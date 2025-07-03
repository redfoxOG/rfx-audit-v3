
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Terminal } from 'lucide-react';

const mockLogLines = [
  "Initializing Dockerized scanner...",
  "Container created: rfx-nmap-8a4fde",
  "Pulling latest Nmap image...",
  "Image pull complete.",
  "Starting Nmap against target...",
  "Nmap scan report for target",
  "Host is up (0.021s latency).",
  "Not shown: 995 closed tcp ports (conn-refused)",
  "PORT      STATE SERVICE",
  "22/tcp    open  ssh",
  "80/tcp    open  http",
  "443/tcp   open  https",
  "3306/tcp  open  mysql",
  "8080/tcp  open  http-proxy",
  "Vulnerability scan starting...",
  "Checking for CVE-2021-44228 (Log4Shell)...",
  "Target appears not vulnerable.",
  "Extracting structured results...",
  "Scan complete. Terminating container.",
  "Results sent to Supabase.",
];

const LiveLogModal = ({ isOpen, onOpenChange, domain }) => {
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      let lineIndex = 0;
      const intervalId = setInterval(() => {
        if (lineIndex < mockLogLines.length) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${mockLogLines[lineIndex]}`]);
          lineIndex++;
        } else {
          clearInterval(intervalId);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] --- STREAM END ---`]);
        }
      }, Math.random() * 800 + 200);

      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

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
