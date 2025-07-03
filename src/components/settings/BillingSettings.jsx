
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillingSettings = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleManageBilling = async () => {
    setLoading(true);
    toast({
        title: "Redirecting to Billing Portal...",
        description: "Please wait while we prepare your secure session.",
    });

    const { data, error } = await supabase.functions.invoke('create-portal-link');

    if (error) {
        toast({
            title: 'Error',
            description: 'Could not create billing portal session. Please try again.',
            variant: 'destructive',
        });
        setLoading(false);
        return;
    }
    
    window.location.href = data.url;
  };
  
  const isPremium = profile?.subscription_status === 'active';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>Manage your subscription plan and payment details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-fira-code">Current Plan: <span className="font-bold text-crimson">{isPremium ? 'Spectre (Premium)' : 'Agent (Free)'}</span></p>
        </div>
        {isPremium ? (
          <Button onClick={handleManageBilling} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Manage Billing & Subscription
          </Button>
        ) : (
          <Button onClick={() => navigate('/pricing')}>Upgrade to Premium</Button>
        )}
         <p className="text-sm text-gray-500 font-fira-code">
          // You will be redirected to our payment partner, Stripe, to manage your subscription.
        </p>
      </CardContent>
    </Card>
  );
};

export default BillingSettings;
