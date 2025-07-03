
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import PremiumLock from '@/components/PremiumLock';

const DomainDialog = ({ isOpen, onOpenChange, domain, onSave }) => {
  const [domainName, setDomainName] = useState('');
  const [schedule, setSchedule] = useState('manual');
  const [scanTypes, setScanTypes] = useState({
    headerCheck: true,
    dnsScan: true,
  });
  const [advancedScanTypes, setAdvancedScanTypes] = useState({
    portScan: false,
    vulnerabilityScan: false,
    sslScan: false,
    fullRecon: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (domain) {
      setDomainName(domain.name || '');
      setSchedule(domain.schedule || 'manual');
      setScanTypes(domain.scan_types?.basic || { headerCheck: true, dnsScan: true });
      setAdvancedScanTypes(domain.scan_types?.advanced || { portScan: false, vulnerabilityScan: false, sslScan: false, fullRecon: false, });
    } else {
      setDomainName('');
      setSchedule('manual');
      setScanTypes({ headerCheck: true, dnsScan: true });
      setAdvancedScanTypes({ portScan: false, vulnerabilityScan: false, sslScan: false, fullRecon: false });
    }
  }, [domain, isOpen]);

  const handleSave = () => {
    if (!domainName.trim()) {
      toast({ title: 'Error: Invalid Target', description: 'Target name cannot be empty.', variant: 'destructive' });
      return;
    }
    onSave({
      name: domainName,
      schedule,
      scan_types: { basic: scanTypes, advanced: advancedScanTypes },
    });
  };

  const handleScanTypeChange = (type, isAdvanced = false) => {
    if (isAdvanced) {
      setAdvancedScanTypes(prev => ({ ...prev, [type]: !prev[type] }));
    } else {
      setScanTypes(prev => ({ ...prev, [type]: !prev[type] }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{domain ? 'Configure Target' : 'Acquire New Target'}</DialogTitle>
          <DialogDescription>
            {domain ? 'Update the parameters for this asset.' : 'Define a new asset for surveillance and assessment.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-3">
          <div className="space-y-2">
            <Label htmlFor="name">Target Domain or IP</Label>
            <Input id="name" name="name" autoComplete="url" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="e.g., example.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule">Assessment Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger id="schedule">
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Only</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Basic Scan Modules</Label>
            <div className="grid grid-cols-2 gap-4 rounded-md border border-neon-red/20 p-4 bg-dark-gray">
              {Object.entries(scanTypes).map(([type, isEnabled]) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox id={`basic-${type}`} checked={isEnabled} onCheckedChange={() => handleScanTypeChange(type, false)} />
                  <Label htmlFor={`basic-${type}`} className="text-sm font-normal capitalize">{type.replace(/([A-Z])/g, ' $1')}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <PremiumLock>
            <div className="space-y-2">
              <Label>Advanced Scan Modules (Premium)</Label>
              <div className="grid grid-cols-2 gap-4 rounded-md border border-neon-red/20 p-4 bg-dark-gray">
                {Object.entries(advancedScanTypes).map(([type, isEnabled]) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox id={`adv-${type}`} checked={isEnabled} onCheckedChange={() => handleScanTypeChange(type, true)} />
                    <Label htmlFor={`adv-${type}`} className="text-sm font-normal capitalize">{type.replace(/([A-Z])/g, ' $1')}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PremiumLock>

        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>
            {domain ? 'Commit Changes' : 'Acquire Target'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DomainDialog;
