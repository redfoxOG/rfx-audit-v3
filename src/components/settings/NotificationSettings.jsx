
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

const NotificationSettings = ({ notificationSettings, onNotificationChange, onSwitchChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerting Channels</CardTitle>
        <CardDescription>Manage how you receive alerts and updates from the system.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-neon-red/20 bg-dark-gray">
          <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
            <span>Email Reports</span>
            <span className="font-normal leading-snug text-gray-400">
              Receive stylish HTML reports for critical findings. (Mocked)
            </span>
          </Label>
          <Switch
            id="emailNotifications"
            checked={notificationSettings.emailNotifications}
            onCheckedChange={(checked) => onSwitchChange('emailNotifications', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Custom Notification Webhook</Label>
          <Input id="webhookUrl" name="webhookUrl" value={notificationSettings.webhookUrl} onChange={onNotificationChange} placeholder="https://your-slack-or-discord-webhook.com" />
          <p className="text-xs text-gray-500 font-fira-code">// A secondary webhook for general notifications (e.g., Slack, Discord).</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSave('notifications')}>
            <Save className="mr-2 h-4 w-4" /> Save Alerting Config
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
