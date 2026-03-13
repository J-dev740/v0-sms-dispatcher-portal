'use client';

import { useState, useEffect } from 'react';
import { SMSComposer } from '@/components/sms-gateway/sms-composer';
import { DevicePreview } from '@/components/sms-gateway/device-preview';
import { SessionLogs, type SMSLog } from '@/components/sms-gateway/session-logs';
import { SettingsPanel } from '@/components/sms-gateway/settings-panel';
import { sendSMS } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const { toast } = useToast();
  
  const [phone, setPhone] = useState('');
  const [senderId, setSenderId] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedMockMode = localStorage.getItem('sms_mock_mode') === 'true';
      const savedLogs = localStorage.getItem('sms_logs');

      setMockMode(savedMockMode);
      if (savedLogs) {
        try {
          setLogs(JSON.parse(savedLogs));
        } catch {
          // Ignore parse errors
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('sms_mock_mode', String(mockMode));
  }, [mockMode]);

  useEffect(() => {
    localStorage.setItem('sms_logs', JSON.stringify(logs));
  }, [logs]);

  const handleSendSMS = async (data: { to: string; from: string; message: string }) => {
    setLoading(true);

    try {
      let result: { success: boolean; messageId?: string; error?: string };

      if (mockMode) {
        // Mock mode: simulate success
        await new Promise((resolve) => setTimeout(resolve, 800));
        result = {
          success: true,
          messageId: `fake_msg_${Date.now()}`,
        };
      } else {
        // Real mode: call Vercel Edge Function with Telynx
        result = await sendSMS({
          phoneNumber: data.to,
          message: data.message,
          senderId: data.from,
          mockMode: false,
        });
      }

      if (result.success) {
        // Add to logs
        const newLog: SMSLog = {
          id: `log_${Date.now()}`,
          recipient: data.to,
          senderId: data.from,
          message: data.message,
          status: 'sent',
          sid: result.messageId,
          timestamp: new Date().toISOString(),
          isMock: mockMode,
        };

        setLogs((prev) => [...prev, newLog]);
        setPhone('');
        setSenderId('');
        setMessage('');

        toast({
          title: mockMode ? 'Mock SMS Sent' : 'SMS Sent Successfully',
          description: `Message to ${data.to} will be delivered shortly.`,
          duration: 3000,
        });
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send SMS';

      console.error('SMS send error:', error);

      toast({
        title: 'Error Sending SMS',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });

      // Log failed attempt
      const failedLog: SMSLog = {
        id: `log_${Date.now()}`,
        recipient: data.to,
        senderId: data.from,
        message: data.message,
        status: 'failed',
        timestamp: new Date().toISOString(),
        isMock: mockMode,
      };

      setLogs((prev) => [...prev, failedLog]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
      toast({
        title: 'Logs Cleared',
        description: 'Session history has been cleared.',
        duration: 2000,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">SMS Gateway Portal</h1>
          <p className="text-slate-600 mt-2">
            Send international SMS with alphanumeric branding
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 mb-6">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SMSComposer
                  onSend={(data) => {
                    setPhone(data.to);
                    setSenderId(data.from);
                    setMessage(data.message);
                    handleSendSMS(data);
                  }}
                  loading={loading}
                  mockMode={mockMode}
                />
              </div>

              <div>
                <DevicePreview
                  senderId={senderId || 'SENDER'}
                  message={message}
                />
              </div>
            </div>

            <SessionLogs logs={logs} onClearLogs={handleClearLogs} />
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <div className="grid grid-cols-1 gap-6">
              <DevicePreview
                senderId={senderId || 'SENDER'}
                message={message || 'Your message will appear here...'}
              />
              <SessionLogs logs={logs} onClearLogs={handleClearLogs} />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsPanel
              mockMode={mockMode}
              onMockModeChange={setMockMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
