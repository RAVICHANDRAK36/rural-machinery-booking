import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './language/LanguageSwitcher';
import { Tractor, LogOut, User, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentRoute }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    onNavigate('/select-role');
  };

  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === 'FARMER') onNavigate('/dashboard/farmer/profile');
    else if (user.role === 'OWNER') onNavigate('/dashboard/owner/profile');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate(user ? `/dashboard/${user.role.toLowerCase()}` : '/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform duration-300">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition">
                  {t('app_name')}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase hidden sm:inline">
                  PROD 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{t('tagline')}</p>
            </div>
          </div>

          {/* Right Navigation & Language & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                
                {/* Profile Pill Button */}
                <button
                  onClick={handleProfileClick}
                  className="bg-slate-900 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center space-x-2 text-xs transition cursor-pointer"
                  title={t('nav.edit_profile')}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-slate-200 hidden sm:inline">{user.name}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border border-emerald-500/30">
                    {user.role}
                  </span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 p-2 sm:px-3 sm:py-1.5 rounded-xl transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>

              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('/select-role')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 hover:scale-105 transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>{t('nav.select_role')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
