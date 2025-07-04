import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, CheckCircle, Target, ShieldCheck, Settings, BarChart3, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';

const StatCard = ({ title, value, icon, description, color = 'crimson', onClick }) => {
  const IconComponent = icon;
  const colorVariants = {
    crimson: 'text-crimson',
    'neon-red': 'text-neon-red',
    'neon-green': 'text-neon-green',
    yellow: 'text-yellow-400',
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2} }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col cursor-pointer"
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm !font-fira-code !text-gray-400 uppercase tracking-wider">{title}</CardTitle>
          <IconComponent className={`h-5 w-5 ${colorVariants[color]}`} />
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center">
          <div className="text-4xl font-bold font-orbitron text-gray-100">{value}</div>
          <p className="text-xs text-gray-500 pt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [stats, setStats] = useState({ totalDomains: 0, criticalAlerts: 0, overallScore: 0 });
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: domains, error: domainsError } = await supabase
        .from('domains')
        .select('id')
        .eq('user_id', user.id);
      
      if (domainsError) throw domainsError;
      
      const domainIds = domains.map(d => d.id);

      const { data: audits, error: auditsError } = await supabase
        .from('audits')
        .select('*, domains(name)')
        .in('domain_id', domainIds)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (auditsError) throw auditsError;

      const totalDomains = domains.length;
      const criticalAlerts = audits.reduce((acc, audit) => acc + (audit.summary?.criticalAlerts || 0), 0);
      const overallScore = totalDomains > 0 ? Math.round(audits.reduce((sum, audit) => sum + (audit.score || 75), 0) / (audits.length || 1)) : 0;
      
      setStats({ totalDomains, criticalAlerts, overallScore });
      setRecentAudits(audits.slice(0, 3));
    } catch (error) {
      toast({ title: 'Dashboard Error', description: `Failed to load intelligence: ${error.message}`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);
  
  useEffect(() => {
    fetchDashboardData();

     const channel = supabase.channel('public:audits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audits' }, payload => {
        fetchDashboardData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };

  }, [fetchDashboardData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <>
    <Helmet>
      <title>Control Center - RedFox Audit Core</title>
      <meta name="description" content="Main dashboard for RedFox Audit Core, your central hub for security monitoring." />
    </Helmet>
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="p-6 border-none bg-gradient-to-r from-dark-gray to-black">
          <h1 className="text-3xl font-bold font-orbitron text-gray-100">Your vulnerabilities exposed.</h1>
          <p className="text-gray-400 font-fira-code">Don’t panic—much. Let's get to work.</p>
        </Card>
      </motion.div>

      <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="h-36 rounded-lg bg-dark-gray animate-pulse" />) :
        <>
          <StatCard title="Active Targets" value={stats.totalDomains} icon={Target} description="Systems under surveillance" onClick={() => navigate('/targets')} />
          <StatCard title="System Integrity" value={`${stats.overallScore}%`} icon={ShieldCheck} description="Average security score" color="neon-green" />
          <StatCard title="Critical Threats" value={stats.criticalAlerts} icon={AlertTriangle} description="High-priority issues found" color="neon-red" />
        </>
        }
      </motion.div>

      <motion.div variants={containerVariants} className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-crimson"/>Recent Activity</CardTitle>
            <CardDescription>Latest system events and assessment logs.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="flex items-center justify-center p-10"><Activity className="h-6 w-6 animate-spin text-crimson" /></div> :
            recentAudits.length > 0 ? recentAudits.map((audit, index) => {
                const Icon = audit.score > 85 ? CheckCircle : AlertTriangle;
                return (
                  <motion.div 
                    key={audit.id || index} 
                    className="flex items-center justify-between p-3 mb-2 rounded-md bg-dark-gray/50 hover:bg-crimson/10 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    onClick={() => navigate(`/assessment/${audit.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${audit.score > 85 ? 'text-neon-green' : 'text-crimson'}`} />
                      <div>
                        <p className="font-medium text-sm text-gray-200">Assessment Complete</p>
                        <p className="text-xs text-gray-400">{audit.domains.name} - Score: {audit.score}%</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(audit.created_at).toLocaleDateString()}</span>
                  </motion.div>
                );
            }) : <p className="text-gray-500 text-center py-4">No recent activity. System is quiet... too quiet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5 text-crimson" /> Quick Actions</CardTitle>
            <CardDescription>Execute common commands.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate('/targets')}>
              <Target className="mr-2 h-4 w-4" /> Manage Targets
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/configuration')}>
              <Settings className="mr-2 h-4 w-4" /> System Configuration
            </Button>
             <Button variant="secondary" className="w-full justify-start" onClick={() => {
              toast({title: "Mock Action", description: "Global re-assessment initiated for all targets."});
            }}>
              <Activity className="mr-2 h-4 w-4" /> Initiate Global Scan
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-crimson"/>Exposure Heat Map (Conceptual)</CardTitle>
            <CardDescription>Visual representation of risk distribution across your assets.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48 text-gray-600">
            <BarChart3 size={48} className="mb-2 text-crimson/50" />
            <p>Heat map visualization will be rendered here.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
    </>
  );
};

export default DashboardPage;