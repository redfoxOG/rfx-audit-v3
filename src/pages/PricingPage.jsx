import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useStripe } from '@stripe/react-stripe-js';

const plans = [
  {
    name: 'Agent',
    price: 'Free',
    description: 'For basic reconnaissance and personal projects.',
    features: [
      '5 Domains',
      'Basic Header & DNS Scans',
      'Manual Scan Triggers',
      'Community Support',
    ],
    isCurrent: (profile) => !profile || profile.subscription_status === 'free' || !profile.subscription_status,
    cta: 'Your Current Plan',
  },
  {
    name: 'Spectre',
    priceId: 'price_1PQRk9RvAPq6gaG4g5h7zRkF', // This should be your actual price ID from Stripe
    lookupKey: 'adv_scan_monthly',
    price: '$49',
    per: '/ month',
    description: 'For professionals who need automated surveillance.',
    features: [
      '50 Domains',
      'All Basic Scans',
      'Automated Recurring Scans',
      'Webhook & n8n Integration',
      'Priority Email Support',
    ],
    isCurrent: (profile) => profile?.subscription_status === 'active',
    isPremium: true,
    cta: 'Upgrade to Spectre',
  },
  {
    name: 'Ghost',
    priceId: null,
    price: 'Contact Us',
    description: 'For enterprises requiring full-spectrum dominance.',
    features: [
      'Unlimited Domains',
      'Advanced Dockerized Scans (Nmap, etc.)',
      'Team Management',
      'Custom Integrations & API Access',
      'Dedicated Support Channel',
    ],
    isCurrent: () => false,
    isPremium: true,
    cta: 'Contact Sales',
  },
];

const PricingCard = ({ plan, onSelectPlan, isCurrentPlan, loadingPlan }) => (
  <Card className={`flex flex-col ${isCurrentPlan ? 'border-crimson shadow-crimson/20' : ''}`}>
    <CardHeader className="text-center">
      <CardTitle className="flex items-center justify-center gap-2">
        {plan.isPremium && <Star className="h-5 w-5 text-yellow-400" />} {plan.name}
      </CardTitle>
      <div className="text-4xl font-bold font-orbitron my-2">
        {plan.price}
        {plan.per && <span className="text-sm font-normal text-gray-400">{plan.per}</span>}
      </div>
      <CardDescription>{plan.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow space-y-3">
      {plan.features.map((feature, i) => (
        <div key={i} className="flex items-start">
          <Check className="h-5 w-5 text-neon-green mr-3 flex-shrink-0" />
          <span className="text-sm text-gray-300">{feature}</span>
        </div>
      ))}
    </CardContent>
    <CardFooter>
      <Button
        className="w-full font-bold tracking-wider"
        onClick={() => onSelectPlan(plan)}
        disabled={isCurrentPlan || loadingPlan}
        variant={plan.isPremium && !isCurrentPlan ? 'default' : 'secondary'}
      >
        {loadingPlan === plan.name ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isCurrentPlan ? 'Current Plan' : plan.cta}
      </Button>
    </CardFooter>
  </Card>
);

const PricingPage = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const stripe = useStripe();

  const handleSelectPlan = async (plan) => {
    if (!plan.priceId) {
      toast({
        title: 'Enterprise Plan',
        description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      });
      return;
    }
    
    if (!stripe) {
      toast({ title: 'Error', description: 'Stripe.js has not loaded yet. Please try again.', variant: 'destructive' });
      return;
    }

    setLoadingPlan(plan.name);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: plan.priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/premium-success`,
        cancelUrl: `${window.location.origin}/premium-cancel`,
        clientReferenceId: user.id,
      });

      if (error) {
        toast({ title: 'Stripe Error', description: error.message, variant: 'destructive' });
      }
    } catch (error) {
        toast({ title: 'Error', description: 'Could not connect to Stripe.', variant: 'destructive' });
    } finally {
        setLoadingPlan(null);
    }
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
        <title>Pricing - RedFox Audit Core</title>
        <meta name="description" content="Choose your plan and upgrade your security operations." />
      </Helmet>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold font-orbitron text-gray-100">Choose Your Arsenal</h1>
          <p className="text-gray-400 font-fira-code mt-2 max-w-2xl mx-auto">
            Scale your operations from lone wolf to full-blown ghost protocol. More power, more possibilities.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div variants={itemVariants} key={plan.name}>
              <PricingCard plan={plan} onSelectPlan={handleSelectPlan} isCurrentPlan={plan.isCurrent(profile)} loadingPlan={loadingPlan} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

export default PricingPage;