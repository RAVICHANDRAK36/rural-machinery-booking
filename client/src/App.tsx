import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SplashPage } from './pages/SplashPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { FarmerDashboard } from './pages/dashboard/FarmerDashboard';
import { FarmerProfile } from './pages/dashboard/FarmerProfile';
import { OwnerDashboard } from './pages/dashboard/OwnerDashboard';
import { OwnerProfile } from './pages/dashboard/OwnerProfile';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { showToast } = useToast();

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigateTo = (routeWithQuery: string) => {
    const [path] = routeWithQuery.split('?');
    setCurrentRoute(path);
    window.history.pushState({}, '', routeWithQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Strict Protected Route Enforcement (Farmer & Owner only)
  useEffect(() => {
    if (loading) return;

    if (currentRoute.startsWith('/dashboard')) {
      if (!user) {
        showToast('Please select your role and login to access dashboard.', 'info');
        navigateTo('/select-role');
      } else {
        // Prevent cross-role access
        if (currentRoute.startsWith('/dashboard/farmer') && user.role !== 'FARMER') {
          navigateTo('/dashboard/owner');
        } else if (currentRoute.startsWith('/dashboard/owner') && user.role !== 'OWNER') {
          navigateTo('/dashboard/farmer');
        }
      }
    }
  }, [currentRoute, user, loading]);

  const handleAuthSuccess = (role: string) => {
    const r = role.toUpperCase();
    if (r === 'FARMER') navigateTo('/dashboard/farmer');
    else if (r === 'OWNER') navigateTo('/dashboard/owner');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold text-xs">
        Loading Rural Machinery Booking System...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header Navigation with Language Switcher */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Dynamic View with Protected Routing */}
      <main className="flex-1">
        
        {/* 1. Splash Page */}
        {currentRoute === '/' && <SplashPage onNavigate={navigateTo} />}

        {/* 2. Role Selection (Farmer & Owner) */}
        {currentRoute === '/select-role' && (
          <RoleSelectionPage onNavigate={navigateTo} />
        )}

        {/* 3. Authentication Pages */}
        {currentRoute === '/auth/login' && (
          <LoginPage
            onNavigate={navigateTo}
            onLoginSuccess={handleAuthSuccess}
          />
        )}

        {currentRoute === '/auth/register' && (
          <RegisterPage
            onNavigate={navigateTo}
            onRegisterSuccess={handleAuthSuccess}
          />
        )}

        {/* 4. Protected Farmer Pages */}
        {user && currentRoute === '/dashboard/farmer' && user.role === 'FARMER' && (
          <FarmerDashboard onNavigate={navigateTo} />
        )}

        {user && currentRoute === '/dashboard/farmer/profile' && user.role === 'FARMER' && (
          <FarmerProfile onNavigate={navigateTo} />
        )}

        {/* 5. Protected Owner Pages */}
        {user && currentRoute === '/dashboard/owner' && user.role === 'OWNER' && (
          <OwnerDashboard onNavigate={navigateTo} />
        )}

        {user && currentRoute === '/dashboard/owner/profile' && user.role === 'OWNER' && (
          <OwnerProfile onNavigate={navigateTo} />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
