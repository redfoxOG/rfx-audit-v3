import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PremiumLock = ({ children, className }) => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div className="blur-sm grayscale pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg p-4">
        <Lock className="h-8 w-8 text-crimson mb-2" />
        <p className="text-white font-bold text-center mb-4 font-orbitron">This is a Premium Feature</p>
        <Button onClick={() => navigate('/pricing')}>Unlock Features</Button>
      </div>
    </div>
  );
};

export default PremiumLock;