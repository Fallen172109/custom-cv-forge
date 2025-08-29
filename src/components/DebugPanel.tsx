import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Copy, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  startedAt: string;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  ok?: boolean;
  responseHeaders?: Record<string, string>;
  bodyText?: string;
  parsedJson?: any;
  jsonParseError?: string;
  durationMsToHeaders?: number;
  durationMsTotal?: number;
  error?: string;
}

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://kamil1721.app.n8n.cloud/webhook/c258248a-a495-4f61-88fd-f703fd357923');
  const [payload, setPayload] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize default payload with current timestamp
  useEffect(() => {
    const defaultPayload = {
      ping: "hello from lovable",
      ts: new Date().toISOString()
    };
    setPayload(JSON.stringify(defaultPayload, null, 2));
  }, []);

  const addLog = (entry: Omit<LogEntry, 'id'>) => {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      ...entry
    };
    setLogs(prev => [logEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
  };

  const getCORSStatus = (headers: Record<string, string>) => {
    const corsHeaders = {
      'access-control-allow-origin': headers['access-control-allow-origin'],
      'access-control-allow-methods': headers['access-control-allow-methods'],
      'access-control-allow-headers': headers['access-control-allow-headers'],
      'content-type': headers['content-type']
    };
    
    const missing = Object.entries(corsHeaders)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    
    return { corsHeaders, missing };
  };

  const getStatusBadge = (entry: LogEntry) => {
    if (entry.error) {
      return <Badge variant="destructive" className="text-xs"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    }
    if (entry.ok) {
      return <Badge variant="default" className="text-xs bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
    }
    if (entry.status) {
      return <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" />{entry.status}</Badge>;
    }
    return null;
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({ description: "Please enter a webhook URL", variant: "destructive" });
      return;
    }

    let parsedPayload;
    try {
      // Update timestamp in payload
      const payloadObj = JSON.parse(payload);
      payloadObj.ts = new Date().toISOString();
      parsedPayload = payloadObj;
      setPayload(JSON.stringify(payloadObj, null, 2));
    } catch (e) {
      toast({ description: "Invalid JSON payload", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const t0 = performance.now();

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload),
        signal: controller.signal,
      });

      const t1 = performance.now();
      const text = await res.text();
      const t2 = performance.now();

      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => headers[k] = v);

      let parsed = null, parseErr = null;
      try { 
        parsed = JSON.parse(text); 
      } catch (e) { 
        parseErr = String(e); 
      }

      const logEntry = {
        startedAt: new Date().toISOString(),
        url: webhookUrl,
        method: 'POST',
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        responseHeaders: headers,
        bodyText: text.slice(0, 10000),
        parsedJson: parsed,
        jsonParseError: parseErr,
        durationMsToHeaders: Math.round(t1 - t0),
        durationMsTotal: Math.round(t2 - t0),
      };

      addLog(logEntry);

      // Update previews if HTML content is returned
      if (parsed && parsed.cv_html) {
        const preview = document.getElementById("cv_preview_html");
        if (preview) {
          preview.innerHTML = parsed.cv_html;
        }
      }

      // Show success toast
      if (res.ok) {
        toast({ description: `Webhook test successful (${res.status})` });
      } else {
        toast({ description: `Webhook returned ${res.status}: ${res.statusText}`, variant: "destructive" });
      }

    } catch (err) {
      addLog({
        startedAt: new Date().toISOString(),
        url: webhookUrl,
        method: 'POST',
        error: String(err)
      });
      toast({ description: `Request failed: ${String(err)}`, variant: "destructive" });
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const copyLogs = () => {
    const logsJson = JSON.stringify(logs.slice(0, 20), null, 2);
    navigator.clipboard.writeText(logsJson);
    toast({ description: "Logs copied to clipboard" });
  };

  const checkAbsoluteUrl = (url: string) => {
    return !url.startsWith('https://kamil1721.app.n8n.cloud/');
  };

  const showUrlWarning = checkAbsoluteUrl(webhookUrl);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-lg border-2">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <CardTitle className="text-sm font-semibold">Debug Panel</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Dev Only</Badge>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Webhook URL</label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="text-xs"
                  placeholder="https://..."
                />
                {showUrlWarning && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600">
                    <AlertTriangle className="w-3 h-3" />
                    Using non-production URL
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block">Payload (JSON)</label>
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="text-xs font-mono h-20"
                  placeholder='{"ping": "hello"}'
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={testWebhook}
                  disabled={isLoading}
                  className="flex-1 text-xs"
                >
                  {isLoading ? 'Testing...' : 'Test n8n Webhook'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={copyLogs}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium">Request Logs ({logs.length})</label>
                </div>
                <ScrollArea className="h-64 border rounded p-2">
                  {logs.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No requests yet. Click "Test n8n Webhook" to start.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((entry) => {
                        const { corsHeaders, missing } = getCORSStatus(entry.responseHeaders || {});
                        return (
                          <div key={entry.id} className="text-xs border rounded p-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {new Date(entry.startedAt).toLocaleTimeString()}
                              </span>
                              {getStatusBadge(entry)}
                            </div>
                            
                            <div className="font-medium">{entry.method} {entry.url}</div>
                            
                            {entry.status && (
                              <div>Status: {entry.status} {entry.statusText} ({entry.durationMsTotal}ms)</div>
                            )}
                            
                            {entry.error && (
                              <div className="text-red-600">Error: {entry.error}</div>
                            )}
                            
                            {missing.length > 0 && (
                              <div className="text-red-600">
                                <AlertTriangle className="w-3 h-3 inline mr-1" />
                                Missing CORS headers: {missing.join(', ')}
                              </div>
                            )}
                            
                            {entry.bodyText && !entry.parsedJson && entry.status && entry.status >= 200 && entry.status < 300 && (
                              <div className="text-yellow-600">
                                <AlertTriangle className="w-3 h-3 inline mr-1" />
                                Response is not JSON. Check Respond to Webhook node.
                              </div>
                            )}
                            
                            {entry.bodyText === '' && entry.status && entry.status >= 200 && entry.status < 300 && (
                              <div className="text-yellow-600">
                                <AlertTriangle className="w-3 h-3 inline mr-1" />
                                Empty response body. Ensure Respond to Webhook returns JSON.
                              </div>
                            )}
                            
                            {entry.bodyText && (
                              <details className="cursor-pointer">
                                <summary className="hover:bg-muted p-1 rounded">Response Body</summary>
                                <pre className="text-[10px] mt-1 p-1 bg-muted rounded overflow-auto max-h-20">
                                  {entry.bodyText}
                                </pre>
                              </details>
                            )}
                            
                            {entry.parsedJson && (
                              <div className="text-green-600">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                JSON parsed successfully: {Object.keys(entry.parsedJson).join(', ')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default DebugPanel;