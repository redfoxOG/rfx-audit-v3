
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Search, Activity, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DomainList from '@/components/domains/DomainList';
import DomainDialog from '@/components/domains/DomainDialog';
import LiveLogModal from '@/components/domains/LiveLogModal';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const n8nWebhookUrl = '/functions/v1/n8n-proxy';

const DomainsPage = () => {
  const [domains, setDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loggingDomain, setLoggingDomain] = useState(null);
  const { toast } = useToast();
  const { user, isPremium } = useAuth();

  const fetchDomains = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (err) {
      setError('Failed to fetch targets. The server might be hostile.');
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchDomains();

      const channel = supabase.channel('public:domains')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'domains', filter: `user_id=eq.${user?.id}` }, payload => {
          fetchDomains();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchDomains]);

  const handleOpenDialog = (domain = null) => {
    setCurrentDomain(domain);
    setIsDialogOpen(true);
  };

  const handleSaveDomain = useCallback(async (domainData) => {
    if (!user) return;
    const domainPayload = {
      ...domainData,
      user_id: user.id
    };
    
    let promise;
    if (currentDomain && currentDomain.id) {
      promise = supabase.from('domains').update(domainPayload).eq('id', currentDomain.id).select().single();
    } else {
      promise = supabase.from('domains').insert(domainPayload).select().single();
    }

    const { data: savedDomain, error } = await promise;
    if (error) {
      toast({ title: 'Operation Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: currentDomain ? 'Target Updated' : 'Target Acquired', description: `${savedDomain.name} configuration saved.` });
      fetchDomains();
      setIsDialogOpen(false);
      setCurrentDomain(null);
    }
  }, [user, currentDomain, toast, fetchDomains]);

  const handleDeleteDomain = useCallback(async (domainId) => {
    const { error } = await supabase.from('domains').delete().eq('id', domainId);
    if (error) {
      toast({ title: 'Failed to Remove Target', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Target Removed', description: 'The target has been removed from surveillance.', variant: 'destructive' });
      fetchDomains();
    }
  }, [toast, fetchDomains]);
  
  const handleRunAudit = useCallback(async (domainId) => {
    const domainToAudit = domains.find(d => d.id === domainId);
    if (!domainToAudit || !user) return;


    const hasAdvancedScans = Object.values(domainToAudit.scan_types?.advanced || {}).some(v => v);

    if (hasAdvancedScans) {
      if (!isPremium) {
        toast({
          title: 'Premium Feature Locked',
          description: 'Advanced scans require a premium subscription. Please upgrade your plan.',
          variant: 'destructive'
        });
        return;
      }
      setLoggingDomain(domainToAudit);
      setIsLogModalOpen(true);
    }

    await supabase.from('domains').update({ status: 'Auditing' }).eq('id', domainId);
    toast({ title: 'Scan Initiated...', description: `Dispatching minions to assess ${domainToAudit.name}.`});
    
    try {
      let url = domainToAudit.name;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      const webhookPayload = {
        url: url,
        email: user.email,
        domain_id: domainToAudit.id,
      };

      const { error: functionError } = await supabase.functions.invoke('n8n-proxy', {
        body: webhookPayload,
      });

      if (functionError) {
        throw new Error(`Webhook dispatch failed: ${functionError.message}`);
      }

      toast({ title: 'Dispatch Confirmed', description: 'n8n workflow triggered successfully. Awaiting results.'});
    } catch(err) {
      toast({ title: 'Dispatch Failed', description: err.message, variant: 'destructive' });
      await supabase.from('domains').update({ status: 'Failed' }).eq('id', domainId);
    }
  }, [domains, user, isPremium, toast]);

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <title>Targets - RedFox Audit Core</title>
        <meta name="description" content="Manage and monitor your target domains and IPs." />
      </Helmet>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-orbitron text-gray-100">Target Management</h1>
            <p className="text-gray-400 font-fira-code">Add, edit, and scan your monitored assets.</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Acquire New Target
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Target Roster</CardTitle>
                  <CardDescription>List of all assets under surveillance.</CardDescription>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search targets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    name="search_targets"
                    id="search_targets"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-10"><Activity className="h-8 w-8 animate-spin text-crimson" /> <p className="ml-3 font-fira-code">Loading targets...</p></div>
              ) : error ? (
                <div className="flex items-center justify-center p-10 text-destructive"><AlertCircle className="h-8 w-8 mr-3" /> <p className="font-fira-code">{error}</p></div>
              ) : (
                <DomainList
                  domains={filteredDomains}
                  onEdit={handleOpenDialog}
                  onDelete={handleDeleteDomain}
                  onRunAudit={handleRunAudit}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <DomainDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          domain={currentDomain}
          onSave={handleSaveDomain}
        />
        <LiveLogModal
          isOpen={isLogModalOpen}
          onOpenChange={setIsLogModalOpen}
          domain={loggingDomain}
        />
      </motion.div>
    </>
  );
};

export default DomainsPage;
