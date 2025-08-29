/**
 * PDF Generation Service
 * 
 * This service provides multiple methods for generating PDFs from HTML content:
 * 1. Client-side generation using html2pdf.js (for immediate download)
 * 2. Server-side generation via API endpoint (for better quality)
 * 3. Browser print API (as fallback)
 */

export class PDFGenerator {
  /**
   * Generate PDF using html2pdf.js library (client-side)
   * This method works entirely in the browser but may have limitations with complex layouts
   */
  static async generatePDFFromHTML(
    htmlContent: string, 
    filename: string = 'document.pdf',
    options: any = {}
  ): Promise<Blob | null> {
    try {
      // Dynamically import html2pdf to avoid bundle size issues
      const html2pdf = await import('html2pdf.js');
      
      // Create a temporary container
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const defaultOptions = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      const finalOptions = { ...defaultOptions, ...options };

      // Generate PDF
      const pdfBlob = await html2pdf.default()
        .set(finalOptions)
        .from(container)
        .outputPdf('blob');

      // Clean up
      document.body.removeChild(container);

      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF with html2pdf:', error);
      return null;
    }
  }

  /**
   * Download PDF directly using html2pdf.js
   */
  static async downloadPDFFromHTML(
    htmlContent: string, 
    filename: string = 'document.pdf',
    options: any = {}
  ): Promise<boolean> {
    try {
      // Dynamically import html2pdf
      const html2pdf = await import('html2pdf.js');
      
      // Create a temporary container
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);

      const defaultOptions = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      const finalOptions = { ...defaultOptions, ...options };

      // Generate and download PDF
      await html2pdf.default()
        .set(finalOptions)
        .from(container)
        .save();

      // Clean up
      document.body.removeChild(container);

      return true;
    } catch (error) {
      console.error('Error downloading PDF with html2pdf:', error);
      return false;
    }
  }

  /**
   * Generate PDF via server-side API (better quality, more reliable)
   * This would require a backend service that can convert HTML to PDF
   */
  static async generatePDFViaAPI(
    htmlContent: string, 
    filename: string = 'document.pdf'
  ): Promise<Blob | null> {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlContent,
          filename: filename,
          options: {
            format: 'A4',
            margin: {
              top: '0.5in',
              right: '0.5in',
              bottom: '0.5in',
              left: '0.5in'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF via API:', error);
      return null;
    }
  }

  /**
   * Fallback method using browser's print functionality
   * Opens print dialog with PDF option
   */
  static printToPDF(htmlContent: string, title: string = 'Document'): void {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Write the HTML content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 0.5in; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        // Close window after printing (optional)
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };
    } catch (error) {
      console.error('Error opening print dialog:', error);
    }
  }

  /**
   * Download blob as file
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Optimize HTML for PDF generation
   * Removes problematic elements and styles that don't work well in PDF
   */
  static optimizeHTMLForPDF(htmlContent: string): string {
    // Create a temporary DOM element to manipulate the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Remove or modify problematic elements
    const elementsToRemove = doc.querySelectorAll('script, iframe, video, audio');
    elementsToRemove.forEach(el => el.remove());

    // Convert relative URLs to absolute URLs if needed
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/')) {
        img.setAttribute('src', window.location.origin + src);
      }
    });

    // Add PDF-specific styles
    const style = doc.createElement('style');
    style.textContent = `
      @media print {
        body { 
          margin: 0; 
          font-family: Arial, sans-serif;
          line-height: 1.4;
        }
        @page { 
          margin: 0.5in; 
          size: A4;
        }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
        a { color: #000; text-decoration: none; }
      }
    `;
    doc.head.appendChild(style);

    return doc.documentElement.outerHTML;
  }

  /**
   * Check if PDF generation is supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'document' in window;
  }
}
