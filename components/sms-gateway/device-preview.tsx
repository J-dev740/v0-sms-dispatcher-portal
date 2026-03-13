'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DevicePreviewProps {
  senderId: string;
  message: string;
  timestamp?: Date;
}

export function DevicePreview({ senderId, message, timestamp = new Date() }: DevicePreviewProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const displayMessage = message || 'Your message will appear here...';
  const displaySenderId = senderId || 'SENDER';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Message Preview</CardTitle>
        <CardDescription>How your SMS will appear</CardDescription>
      </CardHeader>
      <CardContent>
        {/* iPhone-style device mockup */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            {/* Device frame */}
            <div className="rounded-3xl border-8 border-black bg-black p-2 shadow-2xl">
              {/* Screen */}
              <div className="rounded-2xl bg-gray-100 overflow-hidden">
                {/* Status bar */}
                <div className="bg-gray-800 text-white px-4 py-1 text-xs flex justify-between items-center">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>📡</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Messages area */}
                <div className="bg-white h-96 flex flex-col justify-end p-3 space-y-2 overflow-y-auto">
                  {/* Received message */}
                  <div className="flex justify-start">
                    <div className="max-w-xs">
                      {/* Sender info */}
                      <div className="text-xs text-gray-600 mb-1 px-3">
                        <strong>{displaySenderId}</strong>
                        <span className="text-gray-500 ml-2">{formatTime(timestamp)}</span>
                      </div>
                      
                      {/* Message bubble */}
                      <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-none px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {displayMessage}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 bg-white p-3 flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="iMessage"
                    disabled
                    className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-xs text-gray-400"
                  />
                  <button disabled className="text-blue-500 opacity-50 text-xs font-semibold">
                    Send
                  </button>
                </div>
              </div>

              {/* Home indicator */}
              <div className="bg-black h-6 rounded-full mx-auto mt-2 w-24"></div>
            </div>
          </div>
        </div>

        {/* Info text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-xs text-blue-900">
          <p>
            <strong>Note:</strong> This preview shows how the message will appear on the recipient's device. The sender name will display as your configured Sender ID.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
