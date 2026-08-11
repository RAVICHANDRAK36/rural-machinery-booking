import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Tractor, Phone, Lock, ArrowRight, UserCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  initialRole?: string;
  onNavigate: (route: string) => void;
  onLoginSuccess: (role: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole, onNavigate, onLoginSuccess }) => {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<'FARMER' | 'OWNER'>('FARMER');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const roleParam = searchParams.get('role') || initialRole;

    if (roleParam) {
      const upper = roleParam.toUpperCase() as 'FARMER' | 'OWNER';
      if (upper === 'FARMER' || upper === 'OWNER') {
        setSelectedRole(upper);
        if (upper === 'FARMER') setPhone('9876543210');
        else if (upper === 'OWNER') setPhone('9876543211');
      }
    }
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone || !password) {
      setErrorMsg('Please enter both phone number and password.');
      showToast('Please enter both phone number and password.', 'error');
      return;
    }

    setLoading(true);
    const result = await login(phone, password);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Invalid credentials.');
      showToast(result.error || 'Login failed.', 'error');
    } else {
      showToast(`Welcome back, ${result.role}!`, 'success');
      onLoginSuccess(result.role || selectedRole);
    }
  };

  const handleDemoClick = async (role: 'FARMER' | 'OWNER') => {
    setSelectedRole(role);
    if (role === 'FARMER') setPhone('9876543210');
    else if (role === 'OWNER') setPhone('9876543211');

    setLoading(true);
    await demoLogin(role);
    setLoading(false);
    showToast(`Logged in as Demo ${role}`, 'success');
    onLoginSuccess(role);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      
      {/* Back to Role Selection */}
      <button
        onClick={() => onNavigate('/select-role')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('auth.back_to_role')}</span>
      </button>

      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 glow-emerald">
            <Tractor className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">{t('auth.login_title')}</h2>
          <div className="inline-block bg-slate-900 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            {selectedRole === 'FARMER' ? '👨‍🌾 ' + t('roles.farmer') : '🚜 ' + t('roles.owner')}
          </div>
        </div>

        {/* 2-Role Pill Switcher (Farmer & Owner Only) */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-white/5 text-[11px] font-extrabold">
          {(['FARMER', 'OWNER'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setSelectedRole(r);
                if (r === 'FARMER') setPhone('9876543210');
                else if (r === 'OWNER') setPhone('9876543211');
              }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                selectedRole === r
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'FARMER' ? '👨‍🌾 ' + t('roles.farmer') : '🚜 ' + t('roles.owner')}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/30 text-rose-300 p-3.5 rounded-2xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">{t('auth.phone')}</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer glow-emerald text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{t('auth.sign_in')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Section */}
        <div className="border-t border-white/10 pt-5 space-y-3">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('auth.instant_demo')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => handleDemoClick('FARMER')}
              className="p-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-left text-emerald-200 transition cursor-pointer"
            >
              👨‍🌾 {t('roles.farmer')}
              <span className="block font-normal text-[9px] text-emerald-400">Ravi Kumar (Hoskote)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('OWNER')}
              className="p-3 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded-xl text-left text-amber-200 transition cursor-pointer"
            >
              🚜 {t('roles.owner')}
              <span className="block font-normal text-[9px] text-amber-400">Ramesh Kumar (Fleet Owner)</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          {t('auth.dont_have_account')}{' '}
          <button
            onClick={() => onNavigate('/auth/register')}
            className="text-emerald-400 font-bold hover:underline"
          >
            {t('auth.create_account')}
          </button>
        </p>

      </div>
    </div>
  );
};
