
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      navigate('/auth');
    } catch (err) {
      toast({ title: 'Sign Out Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading user data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>
          Manage your account settings, agent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border border-neon-red/20 rounded-lg bg-dark-gray">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-neon-red" />
            <p className="font-fira-code text-sm text-gray-300">Authenticated as:</p>
          </div>
          <p className="font-semibold text-gray-100 font-fira-code break-all">{user.email}</p>
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-neon-red" />
            <p className="font-fira-code text-sm text-gray-300">Status: <span className="text-neon-green">Secure</span></p>
          </div>
        </div>
        <Button onClick={handleSignOut} disabled={loading} variant="destructive" className="w-full font-bold tracking-wider">
          <LogOut className="mr-2 h-4 w-4" /> {loading ? 'Terminating Session...' : 'Logout'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
