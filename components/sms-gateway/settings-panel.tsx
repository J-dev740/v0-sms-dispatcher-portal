'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsPanelProps {
  mockMode: boolean;
  onMockModeChange: (enabled: boolean) => void;
  apiBaseUrl: string;
  onApiBaseUrlChange: (url: string) => void;
  accountConnected?: boolean;
}

export function SettingsPanel({
  mockMode,
  onMockModeChange,
  apiBaseUrl,
  onApiBaseUrlChange,
  accountConnected = false,
}: SettingsPanelProps) {
  const [tempUrl, setTempUrl] = useState(apiBaseUrl);
  const [urlSaved, setUrlSaved] = useState(true);

  useEffect(() => {
    setTempUrl(apiBaseUrl);
    setUrlSaved(true);
  }, [apiBaseUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUrl(e.target.value);
    setUrlSaved(false);
  };

  const handleSaveUrl = () => {
    if (tempUrl.trim()) {
      onApiBaseUrlChange(tempUrl.trim());
      setUrlSaved(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveUrl();
    }
  };

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

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Configuration</CardTitle>
          <CardDescription>Backend API endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url" className="text-sm">
              API Base URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="api-url"
                type="url"
                placeholder="https://api.example.com"
                value={tempUrl}
                onChange={handleUrlChange}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSaveUrl}
                variant={urlSaved ? 'outline' : 'default'}
                size="sm"
              >
                {urlSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For local development: http://localhost:3001
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Status</CardTitle>
          <CardDescription>Twilio integration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {accountConnected ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Connected</span>
                <Badge variant="default" className="ml-auto">
                  Active
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Not configured</span>
                <Badge variant="outline" className="ml-auto">
                  Setup Required
                </Badge>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {accountConnected
              ? 'Your Twilio account is connected and ready to send SMS.'
              : 'Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to backend .env'}
          </p>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-900 space-y-2">
            <p className="font-medium">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Frontend: Deploy to Vercel</li>
              <li>Backend: Deploy to Render or Heroku</li>
              <li>Update API Base URL to backend deployment URL</li>
              <li>Add Twilio credentials to backend .env</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
