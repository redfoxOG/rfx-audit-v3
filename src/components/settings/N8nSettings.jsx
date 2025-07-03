
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Info, Zap } from 'lucide-react';

const mockN8nWorkflowsApi = [
  { id: 'api_wf_1', name: 'Fetched: Security Audit Pipeline' },
  { id: 'api_wf_2', name: 'Fetched: Alert & Remediation Flow' },
  { id: 'api_wf_3', name: 'Fetched: Client Reporting Workflow' },
];

const N8nSettings = ({ n8nSettings, onN8nChange, onSwitchChange, onSelectChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation & Webhooks</CardTitle>
        <CardDescription>Configure webhooks to trigger external workflows and automations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="n8nWebhookUrl">Master Webhook URL</Label>
          <Input id="n8nWebhookUrl" name="n8nWebhookUrl" value={n8nSettings.n8nWebhookUrl} onChange={onN8nChange} placeholder="Enter your n8n or custom webhook URL" />
          <p className="text-xs text-gray-500 font-fira-code">// This endpoint gets pinged with audit data.</p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="selectedN8nWorkflowApi">Default Workflow (Mocked)</Label>
            <Select value={n8nSettings.selectedN8nWorkflowApi || 'none-selected'} onValueChange={(value) => onSelectChange('selectedN8nWorkflowApi', value === 'none-selected' ? '' : value)}>
              <SelectTrigger id="selectedN8nWorkflowApi">
                <SelectValue placeholder="Select workflow (simulated API call)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-selected">None</SelectItem>
                {mockN8nWorkflowsApi.map(wf => (
                  <SelectItem key={wf.id} value={wf.id}>{wf.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 font-fira-code">// Simulates fetching and selecting a pre-configured n8n workflow.</p>
        </div>

        <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-neon-red/20 bg-dark-gray">
          <Label htmlFor="triggerOnCompletion" className="flex flex-col space-y-1">
            <span>Auto-Dispatch on Completion</span>
            <span className="font-normal leading-snug text-gray-400">
              Automatically dispatch payload when an audit finishes.
            </span>
          </Label>
          <Switch
            id="triggerOnCompletion"
            checked={n8nSettings.triggerOnCompletion}
            onCheckedChange={(checked) => onSwitchChange('triggerOnCompletion', checked)}
          />
        </div>
        <div className="p-3 rounded-md border border-neon-red/20 bg-dark-gray">
          <div className="flex items-start">
            <Zap className="h-5 w-5 text-neon-red mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-200">Webhook Deployed</p>
              <p className="text-xs text-gray-400 font-fira-code">
                Your automation minions are on duty.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSave('n8n')}>
            <Save className="mr-2 h-4 w-4" /> Save Automation Config
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8nSettings;
