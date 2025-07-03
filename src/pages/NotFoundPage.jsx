
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
    <Helmet>
      <title>404: Not Found - RedFox Audit Core</title>
    </Helmet>
    <div className="flex flex-col items-center justify-center h-screen text-center p-8 bg-black font-mono relative overflow-hidden">
      <div className="scanline-overlay"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <AlertTriangle className="w-32 h-32 text-crimson mb-8" />
      </motion.div>
      
      <motion.h1 
        className="text-6xl font-bold mb-4 font-orbitron text-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        404
      </motion.h1>
      
      <motion.p 
        className="text-2xl text-gray-400 mb-8 font-fira-code"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Error: Path not found.
      </motion.p>
      
      <motion.p 
        className="text-lg text-gray-500 mb-12 max-w-md font-fira-code"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        The resource you're looking for is either classified, moved, or never existed. Check your coordinates.
      </motion.p>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button asChild size="lg">
          <Link to="/dashboard">Return to Control Center</Link>
        </Button>
      </motion.div>
    </div>
    </>
  );
};

export default NotFoundPage;
