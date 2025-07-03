
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const GeneralSettings = ({ settings, onSettingsChange, onSelectChange, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Parameters</CardTitle>
        <CardDescription>Configure the core behavior of the RFx Audit system.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Application Theme</Label>
          <Select value={settings.theme} onValueChange={(value) => onSelectChange('theme', value)} disabled>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark Mode (Forced)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 font-fira-code">// Light mode is a liability. We don't do that here.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultScanProfile">Default Scan Profile</Label>
           <Select value={settings.defaultScanProfile} onValueChange={(value) => onSelectChange('defaultScanProfile', value)}>
            <SelectTrigger id="defaultScanProfile">
              <SelectValue placeholder="Select default scan profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quick">Recon Scan (Essentials)</SelectItem>
              <SelectItem value="balanced">Balanced Infiltration (Recommended)</SelectItem>
              <SelectItem value="deep">Deep Exploit (Comprehensive)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 font-fira-code">// Sets the default attack vector for new targets.</p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onSave('general')}>
            <Save className="mr-2 h-4 w-4" /> Commit Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
