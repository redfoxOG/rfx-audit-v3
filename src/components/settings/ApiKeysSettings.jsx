
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

const ApiKeysSettings = ({ apiSettings, onApiChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>External API Keys</CardTitle>
        <CardDescription>
          Integrate external intelligence feeds. Keys are stored locally.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nvdApiKey">NVD API Key</Label>
          <Input id="nvdApiKey" name="nvdApiKey" type="password" value={apiSettings.nvdApiKey} onChange={onApiChange} placeholder="Enter NVD API Key" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shodanApiKey">Shodan API Key</Label>
          <Input id="shodanApiKey" name="shodanApiKey" type="password" value={apiSettings.shodanApiKey} onChange={onApiChange} placeholder="Enter Shodan API Key" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="virusTotalApiKey">VirusTotal API Key</Label>
          <Input id="virusTotalApiKey" name="virusTotalApiKey" type="password" value={apiSettings.virusTotalApiKey} onChange={onApiChange} placeholder="Enter VirusTotal API Key" />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onSave('api')}>
            <Save className="mr-2 h-4 w-4" /> Save API Keys
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysSettings;
