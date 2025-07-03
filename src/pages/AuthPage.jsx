
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { Helmet } from 'react-helmet-async';

const AuthPage = () => {
  return (
    <>
      <Helmet>
        <title>Authentication - RedFox Audit Core</title>
        <meta name="description" content="Secure login or registration for RedFox Audit Core." />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-black p-4 font-mono relative overflow-hidden">
        <div className="scanline-overlay"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="relative z-10 w-full max-w-md p-8 space-y-8 bg-dark-gray/70 border border-crimson/30 rounded-lg shadow-2xl shadow-crimson/10 backdrop-blur-md"
        >
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-crimson" />
          </div>
          <AuthForm />
        </motion.div>

        <footer className="absolute bottom-4 text-center w-full text-xs text-gray-600 font-fira-code z-20">
          <p>&copy; {new Date().getFullYear()} RedFox Securities. We're probably watching.</p>
        </footer>
      </div>
    </>
  );
};

export default AuthPage;
