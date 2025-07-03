
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Helmet } from 'react-helmet-async';
import { CheckCircle } from 'lucide-react';

const PremiumSuccessPage = () => {
  const navigate = useNavigate();
  const { refetchProfile } = useAuth();

  useEffect(() => {
    refetchProfile();

    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [navigate, refetchProfile]);

  return (
    <>
      <Helmet>
        <title>Upgrade Successful - RedFox Audit Core</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center h-full text-center">
        <CheckCircle className="h-24 w-24 text-neon-green mb-6" />
        <h1 className="text-4xl font-bold font-orbitron text-gray-100 mb-4">Upgrade Complete</h1>
        <p className="text-gray-400 font-fira-code max-w-md mb-8">
          Access to Spectre-level features has been granted. Your digital ghost just got an upgrade.
        </p>
        <p className="text-gray-500">Redirecting to Control Center shortly...</p>
      </div>
    </>
  );
};

export default PremiumSuccessPage;
