
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Bell, Zap, UserCircle, Settings as SettingsIcon, Rocket, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ApiKeysSettings from '@/components/settings/ApiKeysSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import N8nSettings from '@/components/settings/N8nSettings';
import AdvancedOptions from '@/components/settings/AdvancedOptions';
import AccountSettings from '@/components/settings/AccountSettings'; 
import GeneralSettings from '@/components/settings/GeneralSettings';
import BillingSettings from '@/components/settings/BillingSettings';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DeploymentSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Deployment: From Playground to Battleground</CardTitle>
      <CardDescription>This is your engineering playbook, "From Zero to GhostNode." Guidelines for deploying RFx-Audit in a self-hosted environment.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 border border-neon-red/20 rounded-lg bg-dark-gray">
        <h4 className="font-bold text-gray-200">Docker Compose</h4>
        <p className="text-sm text-gray-400 mt-1">The recommended method for rapid deployment. The structure is prepared for seamless integration.</p>
        <code className="block bg-black/50 p-2 rounded-md text-xs mt-2 text-neon-green overflow-x-auto">
          git clone [repo_url] <br/>
          cd rfx-audit-core <br/>
          docker-compose up -d
        </code>
      </div>
      <div className="p-4 border border-neon-red/20 rounded-lg bg-dark-gray">
        <h4 className="font-bold text-gray-200">Environment Variables</h4>
        <p className="text-sm text-gray-400 mt-1">Ensure you have a <code className="text-xs bg-black/50 p-1 rounded">.env</code> file configured with your Supabase and other service credentials.</p>
      </div>
      <p className="text-xs text-gray-500 font-fira-code">// This UI is modular and ready for integration with Portainer or Kubernetes.</p>
    </CardContent>
  </Card>
);

const SettingsPage = () => {
  const { toast } = useToast();

  const [apiSettings, setApiSettings] = useState({ nvdApiKey: '', shodanApiKey: '', virusTotalApiKey: '' });
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: true, webhookUrl: '' });
  const [n8nSettings, setN8nSettings] = useState({ n8nWebhookUrl: '', triggerOnCompletion: false, selectedN8nWorkflowApi: '' });
  const [generalAppSettings, setGeneralAppSettings] = useState({ theme: 'dark', defaultScanProfile: 'balanced' });

  useEffect(() => {
    const storedApiSettings = JSON.parse(localStorage.getItem('apiSettings'));
    if (storedApiSettings) setApiSettings(storedApiSettings);

    const storedNotificationSettings = JSON.parse(localStorage.getItem('notificationSettings'));
    if (storedNotificationSettings) setNotificationSettings(storedNotificationSettings);
    
    const storedN8nSettings = JSON.parse(localStorage.getItem('n8nSettings'));
    if (storedN8nSettings) setN8nSettings(storedN8nSettings);

    const storedGeneralSettings = JSON.parse(localStorage.getItem('generalAppSettings'));
    if (storedGeneralSettings) setGeneralAppSettings(storedGeneralSettings);

  }, []);

  const handleApiChange = (e) => setApiSettings({ ...apiSettings, [e.target.name]: e.target.value });
  const handleNotificationChange = (e) => setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.value });
  const handleN8nChange = (e) => setN8nSettings({ ...n8nSettings, [e.target.name]: e.target.value });
  const handleGeneralSettingsChange = (e) => setGeneralAppSettings({ ...generalAppSettings, [e.target.name]: e.target.value });

  const handleSelectChange = (category, field, value) => {
    if (category === 'n8n') setN8nSettings(prev => ({ ...prev, [field]: value }));
    else if (category === 'general') setGeneralAppSettings(prev => ({...prev, [field]: value}));
  };

  const handleSwitchChange = (category, field, checked) => {
    if (category === 'notifications') setNotificationSettings(prev => ({ ...prev, [field]: checked }));
    else if (category === 'n8n') setN8nSettings(prev => ({ ...prev, [field]: checked }));
  };

  const handleSaveSettings = (category) => {
    let settingsToSave, storageKey;
    switch(category) {
      case 'api': settingsToSave = apiSettings; storageKey = 'apiSettings'; break;
      case 'notifications': settingsToSave = notificationSettings; storageKey = 'notificationSettings'; break;
      case 'n8n': settingsToSave = n8nSettings; storageKey = 'n8nSettings'; break;
      case 'general': settingsToSave = generalAppSettings; storageKey = 'generalAppSettings'; break;
      default: toast({ title: 'Error', description: 'Invalid settings category.', variant: 'destructive' }); return;
    }
    
    localStorage.setItem(storageKey, JSON.stringify(settingsToSave));
    toast({
      title: 'Configuration Saved',
      description: `${category.charAt(0).toUpperCase() + category.slice(1)} parameters have been updated.`,
    });
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setApiSettings({ nvdApiKey: '', shodanApiKey: '', virusTotalApiKey: '' });
    setNotificationSettings({ emailNotifications: true, webhookUrl: '' });
    setN8nSettings({ n8nWebhookUrl: '', triggerOnCompletion: false, selectedN8nWorkflowApi: '' });
    setGeneralAppSettings({ theme: 'dark', defaultScanProfile: 'balanced' });
    toast({ title: 'Data Cleared', description: 'All local application data has been removed.', variant: 'destructive'});
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
    <Helmet>
      <title>Configuration - RedFox Audit Core</title>
      <meta name="description" content="System configuration for RedFox Audit Core." />
    </Helmet>
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold font-orbitron text-gray-100">System Configuration</h1>
        <p className="text-gray-400 font-fira-code">Manage system parameters, integrations, and account settings.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 mb-6">
            <TabsTrigger value="general"><SettingsIcon className="mr-2 h-4 w-4" /> General</TabsTrigger>
            <TabsTrigger value="account"><UserCircle className="mr-2 h-4 w-4" /> Account</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="mr-2 h-4 w-4" /> Billing</TabsTrigger>
            <TabsTrigger value="apiKeys"><Key className="mr-2 h-4 w-4" /> API Keys</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" /> Alerting</TabsTrigger>
            <TabsTrigger value="n8n"><Zap className="mr-2 h-4 w-4" /> Automation</TabsTrigger>
            <TabsTrigger value="deployment"><Rocket className="mr-2 h-4 w-4" /> Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings 
              settings={generalAppSettings}
              onSettingsChange={handleGeneralSettingsChange}
              onSelectChange={(field, value) => handleSelectChange('general', field, value)}
              onSave={() => handleSaveSettings('general')}
            />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="apiKeys">
            <ApiKeysSettings 
              apiSettings={apiSettings} 
              onApiChange={handleApiChange} 
              onSave={() => handleSaveSettings('api')} 
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings 
              notificationSettings={notificationSettings} 
              onNotificationChange={handleNotificationChange} 
              onSwitchChange={(field, checked) => handleSwitchChange('notifications', field, checked)}
              onSave={() => handleSaveSettings('notifications')}
            />
          </TabsContent>
          
          <TabsContent value="n8n">
            <N8nSettings 
              n8nSettings={n8nSettings}
              onN8nChange={handleN8nChange}
              onSwitchChange={(field, checked) => handleSwitchChange('n8n', field, checked)}
              onSelectChange={(field, value) => handleSelectChange('n8n', field, value)}
              onSave={() => handleSaveSettings('n8n')}
            />
          </TabsContent>

          <TabsContent value="deployment">
            <DeploymentSettings />
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AdvancedOptions onClearData={handleClearAllData} />
      </motion.div>
    </motion.div>
    </>
  );
};

export default SettingsPage;
