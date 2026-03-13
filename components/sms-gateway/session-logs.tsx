'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy } from 'lucide-react';

export interface SMSLog {
  id: string;
  recipient: string;
  senderId: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  sid?: string; // Twilio SID
  timestamp: string;
  isMock?: boolean;
}

interface SessionLogsProps {
  logs: SMSLog[];
  onClearLogs: () => void;
}

export function SessionLogs({ logs, onClearLogs }: SessionLogsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string, isMock?: boolean) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      sent: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };

    const labels: Record<string, string> = {
      sent: 'Delivered',
      pending: 'Pending',
      failed: 'Failed',
    };

    const badge = (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );

    if (isMock) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Mock</Badge>
          {badge}
        </div>
      );
    }

    return badge;
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Session Logs</CardTitle>
          <CardDescription>{logs.length} message(s) sent</CardDescription>
        </div>
        {logs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearLogs}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No messages sent yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Compose and send an SMS to see it appear here.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Recipient</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead className="max-w-xs">Message</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice().reverse().map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      <button
                        onClick={() => handleCopyToClipboard(log.recipient, log.id)}
                        className="hover:text-blue-600 flex items-center gap-1"
                        title="Click to copy"
                      >
                        {log.recipient}
                        <Copy
                          className={`h-3 w-3 transition-opacity ${
                            copiedId === log.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="font-semibold">{log.senderId}</TableCell>
                    <TableCell className="text-sm max-w-xs">
                      <span title={log.message} className="truncate block">
                        {truncateText(log.message)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status, log.isMock)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatTime(log.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-900">
            <p>
              <strong>Session Info:</strong> Logs are stored locally in your browser. They will be cleared when you close this page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
