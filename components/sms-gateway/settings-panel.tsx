'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsPanelProps {
  mockMode: boolean;
  onMockModeChange: (enabled: boolean) => void;
}

export function SettingsPanel({
  mockMode,
  onMockModeChange,
}: SettingsPanelProps) {

  return (
    <div className="space-y-4">
      {/* Mock Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mock Mode</CardTitle>
          <CardDescription>Test without using SMS credits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mock-mode" className="text-sm font-medium">
                Enable Mock Mode
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, SMS won't be sent. Messages will show as delivered with a Mock badge.
              </p>
            </div>
            <Switch
              id="mock-mode"
              checked={mockMode}
              onCheckedChange={onMockModeChange}
            />
          </div>

          {mockMode && (
            <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>Mock mode is active. No actual SMS will be sent.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration Status</CardTitle>
          <CardDescription>Telynx SMS gateway connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Connected</span>
            <Badge variant="default" className="ml-auto">
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Your Telynx account is connected and ready to send SMS via Vercel Edge Functions.
          </p>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-900 space-y-2">
            <p className="font-medium">Deployment:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Deploy to Vercel (backend is serverless)</li>
              <li>Add TELYNX_API_KEY to Vercel environment variables</li>
              <li>SMS is sent via Vercel Edge Functions</li>
              <li>No separate backend deployment required</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
