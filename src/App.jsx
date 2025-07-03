import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import DomainsPage from '@/pages/DomainsPage';
import AuditReportPage from '@/pages/AuditReportPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import PublicRoute from '@/components/PublicRoute';
import AuthPage from '@/pages/AuthPage';
import PricingPage from '@/pages/PricingPage';
import PremiumSuccessPage from '@/pages/PremiumSuccessPage';
import PremiumCancelPage from '@/pages/PremiumCancelPage';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/auth" element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } />
            <Route path="/*" element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/targets" element={<DomainsPage />} />
                    <Route path="/assessment/:auditId" element={<AuditReportPage />} />
                    <Route path="/configuration" element={<SettingsPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/premium-success" element={<PremiumSuccessPage />} />
                    <Route path="/premium-cancel" element={<PremiumCancelPage />} />
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }/>
          </Routes>
          <Toaster />
        </Router>
      </Elements>
    </AuthProvider>
  );
}

export default App;
