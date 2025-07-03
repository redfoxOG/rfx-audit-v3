import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Globe, Settings, Menu, X, Sun, Moon, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Control Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Targets', href: '/targets', icon: Globe },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Configuration', href: '/configuration', icon: Settings },
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const sidebarVariants = {
    open: { width: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const contentVariants = {
    open: { marginLeft: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { marginLeft: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const navItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };
  
  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/assessment')) return 'Damage Assessment';
    const currentNavItem = navItems.find(item => item.href === pathname);
    return currentNavItem ? currentNavItem.name : "RedFox";
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="scanline-overlay" />
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full bg-dark-gray/50 backdrop-blur-md border-r border-neon-red/20 text-gray-200 shadow-xl flex flex-col z-50"
      >
        <div className={cn("p-4 flex items-center h-20 border-b border-neon-red/20", isSidebarOpen ? "justify-between" : "justify-center")}>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20}} transition={{ duration: 0.2 }}>
                <NavLink to="/dashboard" className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-crimson" />
                  <span className="text-2xl font-bold font-orbitron">RedFox</span>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:text-white hover:bg-crimson/10">
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="flex-grow mt-4 px-4">
          {navItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-4 p-3 my-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-crimson/10",
                  isActive ? "bg-crimson/20 text-white shadow-inner shadow-crimson/10" : "text-gray-400 hover:text-white hover:translate-x-1",
                  !isSidebarOpen && "justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * index + 0.1 }} className="font-medium font-fira-code">{item.name}</motion.span>}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
        <div className={cn("p-4 mt-auto border-t border-neon-red/20", !isSidebarOpen && "flex flex-col items-center")}>
            <Button variant="ghost" onClick={handleSignOut} className={cn("w-full text-gray-400 hover:text-white hover:bg-crimson/10", isSidebarOpen ? "justify-start" : "justify-center")}>
                <LogOut className="h-5 w-5 mr-4" />
                {isSidebarOpen && <span className="font-fira-code">Logout</span>}
            </Button>
        </div>
      </motion.aside>

      <motion.main
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={contentVariants}
        className="flex-1 flex flex-col overflow-y-auto"
      >
        <header className="sticky top-0 bg-dark-gray/30 backdrop-blur-md shadow-sm p-4 z-40 border-b border-neon-red/20 h-20 flex items-center">
          <div className="container mx-auto flex justify-between items-center">
            <motion.h1 
              key={location.pathname} 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-100 font-orbitron"
            >
              {getPageTitle(location.pathname)}
            </motion.h1>
            <div>
              <div className="w-10 h-10 bg-dark-gray border border-neon-red/20 rounded-full flex items-center justify-center text-crimson font-bold">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-grow p-6 container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={navItemVariants}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;