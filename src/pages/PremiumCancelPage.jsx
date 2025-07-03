
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PremiumCancelPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Upgrade Canceled - RedFox Audit Core</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="h-24 w-24 text-yellow-400 mb-6" />
        <h1 className="text-4xl font-bold font-orbitron text-gray-100 mb-4">Operation Aborted</h1>
        <p className="text-gray-400 font-fira-code max-w-md mb-8">
          The transaction was canceled. Your agent status remains unchanged. You can try again whenever you're ready.
        </p>
        <Button onClick={() => navigate('/pricing')}>Return to Arsenal</Button>
      </div>
    </>
  );
};

export default PremiumCancelPage;
