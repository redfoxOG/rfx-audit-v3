import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, ListChecks, ExternalLink, ArrowLeft, Download, Code, Activity, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const AuditReportPage = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    if (!user || !auditId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*, domains(name, user_id)')
        .eq('id', auditId)
        .single();
      
      if (error) throw error;
      if (data.domains.user_id !== user.id) {
        throw new Error("Access denied. This is not your report.");
      }

      setReport(data);
    } catch (err) {
      toast({
        title: 'Error Loading Assessment',
        description: err.message,
        variant: 'destructive',
      });
      navigate('/targets');
    } finally {
      setLoading(false);
    }
  }, [auditId, user, navigate, toast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Activity className="animate-spin h-10 w-10 text-crimson" /><p className="text-xl text-crimson ml-3 font-fira-code">Loading assessment...</p></div>;
  }

  if (!report) {
    return <div className="flex justify-center items-center h-full"><AlertTriangle className="h-10 w-10 text-destructive" /><p className="text-xl text-destructive ml-3 font-fira-code">Assessment unavailable.</p></div>;
  }

  const getScoreColorClasses = (score) => {
    if (score >= 85) return 'from-neon-green/80 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-amber-600';
    return 'from-crimson to-red-600';
  };
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: {type: 'spring', stiffness: 100} } };
  
  const mockRecommendations = [
    "This isn’t just a report, it’s your digital autopsy. Let’s patch you up.",
    "Implement a strong Content Security Policy (CSP). Don't let them run scripts in your house.",
    "Update all software. Unpatched systems are like unlocked doors with a 'welcome' mat.",
    "Review DNS records (SPF, DMARC). Don't let others send emails in your name.",
  ];

  const generateMarkdownReport = () => {
    let md = `# Damage Assessment: ${report.domains.name}\n\n`;
    md += `**Date:** ${new Date(report.created_at).toLocaleString()}\n`;
    md += `**Security Score:** ${report.score}\n\n`;
    md += `## Executive Debriefing\n`;
    md += `- Critical Threats: ${report.summary.criticalAlerts}\n`;
    md += `- Attack Vectors: ${report.summary.vulnerabilities}\n`;
    md += `- Encryption Status: ${report.summary.sslValid ? 'Secure' : 'Compromised'}\n`;
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RFX_Assessment_${report.domains.name.replace(/\./g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({title: "Markdown Report Generated", description: "The assessment file has been downloaded."});
  };

  return (
    <>
      <Helmet>
        <title>Assessment: {report.domains.name} - RedFox Audit Core</title>
        <meta name="description" content={`Detailed security assessment for ${report.domains.name}.`} />
      </Helmet>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Button variant="outline" onClick={() => navigate('/targets')} className="self-start sm:self-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Targets
          </Button>
          <div className="flex gap-2 self-end sm:self-center">
            <Button onClick={generateMarkdownReport} variant="secondary">
              <Code className="mr-2 h-4 w-4" /> Export MD
            </Button>
            <Button onClick={() => toast({title: "PDF Export", description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"})}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none">
            <div className={`p-6 bg-gradient-to-r ${getScoreColorClasses(report.score)} text-white`}>
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold font-orbitron">{report.domains.name}</h1>
                  <p className="text-sm opacity-80 font-fira-code">Assessment Date: {new Date(report.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-5xl font-bold font-orbitron">{report.score}</p>
                  <p className="text-sm opacity-80 font-fira-code">Security Score</p>
                </div>
              </div>
              <Progress value={report.score} className="mt-4 h-2" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><ListChecks className="mr-3 h-6 w-6 text-crimson" /> Digital Autopsy</CardTitle>
              <CardDescription>This isn’t just a report, it’s your digital autopsy. Let’s patch you up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CollapsibleSection title="Security Summary" defaultOpen={true}>
                <p>Critical Alerts: <span className="font-semibold text-crimson">{report.summary?.criticalAlerts || 0}</span></p>
                <p>Total Vulnerabilities: <span className="font-semibold">{report.summary?.vulnerabilities || 0}</span></p>
                <p>SSL/TLS Valid: {report.summary?.sslValid ? <CheckCircle className="inline h-5 w-5 text-neon-green" /> : <AlertTriangle className="inline h-5 w-5 text-crimson" />}</p>
              </CollapsibleSection>
              
              {report.details?.headers && (
                <CollapsibleSection title="HTTP Headers Analysis">
                  {Object.entries(report.details.headers).map(([key, value]) => (
                    <div key={key} className="text-sm p-2 bg-dark-gray/50 rounded font-fira-code">
                      <strong className="text-gray-300">{key}:</strong> <span className="text-gray-400 break-all">{value}</span>
                    </div>
                  ))}
                </CollapsibleSection>
              )}
              
              <CollapsibleSection title="Remediation Strategy">
                 <ul className="list-disc list-inside space-y-2 text-sm">
                  {mockRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </CollapsibleSection>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><ExternalLink className="mr-3 h-6 w-6 text-crimson" /> External Reconnaissance</CardTitle>
            <CardDescription>Third-party tools for further analysis of {report.domains.name}.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => window.open(`https://securityheaders.com/?q=${report.domains.name}&followRedirects=on`, '_blank')}>SecurityHeaders.io</Button>
            <Button variant="outline" onClick={() => window.open(`https://www.ssllabs.com/ssltest/analyze.html?d=${report.domains.name}`, '_blank')}>SSL Labs Test</Button>
            <Button variant="outline" onClick={() => window.open(`https://mxtoolbox.com/SuperTool.aspx?action=scan%3a${report.domains.name}&run=toolpage`, '_blank')}>MXToolbox Scan</Button>
          </CardContent>
        </Card>
      </motion.div>
      </motion.div>
    </>
  );
};

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-neon-red/10 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-md font-bold text-gray-200 font-orbitron">{title}</h3>
        <ChevronDown className={`h-5 w-5 text-crimson transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-2 text-sm text-gray-400">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditReportPage;