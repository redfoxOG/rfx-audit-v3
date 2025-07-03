
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, UserPlus, AlertCircle, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlitchText = ({ text }) => (
  <div className="relative inline-block">
    <span className="glitch-text" data-text={text}>{text}</span>
  </div>
);

const AuthForm = () => {
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        throw authError;
      }

      if (isSignUp) {
        toast({
          title: <div className="flex items-center"><Terminal className="mr-2 h-4 w-4 text-neon-green" /><span>Account Created</span></div>,
          description: 'Verification link sent. Check your inbox to complete the breach.',
        });
      } else {
        toast({
          title: <div className="flex items-center"><Terminal className="mr-2 h-4 w-4 text-neon-green" /><span>Access Granted</span></div>,
          description: 'Booting Control Center...',
        });
        navigate('/dashboard');
      }
      
    } catch (err) {
      const errorMessage = err.message || 'An unknown anomaly occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Payload Anomaly Detected',
        description: `Your request got lost in translation. System says: "${errorMessage}"`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm space-y-6"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold font-orbitron text-gray-100 tracking-wider">
          <GlitchText text={isSignUp ? 'JOIN THE CORE' : 'SECURE LOGIN'} />
        </h1>
        <p className="mt-2 text-gray-400 font-fira-code text-sm">
          {isSignUp ? 'Create your credentials to breach the system.' : 'Authenticate to access the control center.'}
        </p>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-crimson/10 border border-crimson/50 text-crimson flex items-center text-xs font-fira-code">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="agent@rfx.sec" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full font-bold tracking-wider">
            {isSignUp ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
            {loading ? 'Processing...' : (isSignUp ? 'Register' : 'Initiate Access')}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <Button variant="link" type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-sm font-fira-code">
          {isSignUp ? 'Already an agent? Secure Login' : "Need access? Register here"}
        </Button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
