
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Terminal } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const LiveLogModal = ({ isOpen, onOpenChange, domain }) => {
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !domain) return;

    setLogs([]);

    const fetchInitialLogs = async () => {
      const { data, error } = await supabase
        .from('logs')
        .select('message, inserted_at')
        .eq('domain_id', domain.id)
        .order('inserted_at', { ascending: true });

      if (!error && data) {
        const formatted = data.map(row => `[${new Date(row.inserted_at).toLocaleTimeString()}] ${row.message}`);
        setLogs(formatted);
      }
    };

    fetchInitialLogs();

    const channel = supabase.channel(`public:logs:domain_${domain.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'logs', filter: `domain_id=eq.${domain.id}` },
        payload => {
          const msg = payload.new?.message;
          const time = payload.new?.inserted_at || new Date().toISOString();
          if (msg) {
            setLogs(prev => [...prev, `[${new Date(time).toLocaleTimeString()}] ${msg}`]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, domain]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-neon-green" />
            Live Scan Log: {domain?.name}
          </DialogTitle>
          <DialogDescription>
            Real-time output from the Dockerized scanning engine. Do not close this window.
          </DialogDescription>
        </DialogHeader>
        <div 
          ref={logContainerRef}
          className="mt-4 p-4 bg-black rounded-md h-80 overflow-y-auto border border-neon-green/20"
        >
          <pre className="text-xs text-neon-green font-fira-code whitespace-pre-wrap">
            {logs.map((log, index) => (
              <div key={index} className="animate-fadeIn">{log}</div>
            ))}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveLogModal;
