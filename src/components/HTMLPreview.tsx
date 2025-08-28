export default function HTMLPreview({ html }: { html: string }) {
  return (
    <iframe
      title="preview"
      className="w-full h-[720px] rounded-xl border"
      sandbox="allow-same-origin"
      srcDoc={html}
    />
  );
}