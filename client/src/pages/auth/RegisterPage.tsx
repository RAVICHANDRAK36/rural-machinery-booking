import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { LocationSearch, LocationData } from '../../components/location/LocationSearch';
import { Tractor, ArrowRight, ArrowLeft, Eye, EyeOff, Building2 } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (route: string) => void;
  onRegisterSuccess: (role: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Hoskote');
  const [taluk, setTaluk] = useState('Hoskote');
  const [district, setDistrict] = useState('Bengaluru Rural');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(13.0712);
  const [longitude, setLongitude] = useState<number | undefined>(77.7983);
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState<'FARMER' | 'OWNER'>('FARMER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLocationSelect = (loc: LocationData) => {
    setVillage(loc.village);
    setTaluk(loc.taluk);
    setDistrict(loc.district);
    setAddress(loc.formattedAddress);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !phone || !village || !taluk || !district || !password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      showToast('Please fill out all registration fields.', 'error');
      return;
    }

    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      showToast('Invalid phone number.', 'error');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      phone,
      village,
      taluk,
      district,
      address,
      latitude,
      longitude,
      business_name: role === 'OWNER' ? businessName : null,
      preferred_language: language,
      role,
      password
    });
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Registration failed.');
      showToast(result.error || 'Registration failed.', 'error');
    } else {
      showToast('Account registered successfully! Logging you in...', 'success');
      onRegisterSuccess(result.role || role);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 px-4 space-y-6">
      
      <button
        onClick={() => onNavigate('/select-role')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('auth.back_to_role')}</span>
      </button>

      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 glow-emerald">
            <Tractor className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">{t('auth.create_account')}</h2>
          <p className="text-xs text-slate-400">{t('tagline')}</p>
        </div>

        {/* Role Selector Tabs (Farmer & Owner Only) */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-white/5 text-[11px] font-extrabold">
          {(['FARMER', 'OWNER'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2.5 rounded-xl transition cursor-pointer ${
                role === r
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.full_name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Gowda"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.phone')}</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {role === 'OWNER' && (
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.business_name')}</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sri Manjunatha Agricultural Machinery Works"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-semibold"
                />
              </div>
            </div>
          )}

          {/* Location Search Autocomplete Component */}
          <div className="border-t border-white/10 pt-3">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Search village, taluk, or landmark across Karnataka..."
              label={t('profile.location_search_label')}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.village')}</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.taluk')}</label>
              <input
                type="text"
                required
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.district')}</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">{t('auth.confirm_password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Match password"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer glow-emerald text-sm mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{t('auth.create_account')} & Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          {t('auth.already_have_account')}{' '}
          <button
            onClick={() => onNavigate('/auth/login')}
            className="text-emerald-400 font-bold hover:underline"
          >
            {t('auth.sign_in')}
          </button>
        </p>

      </div>
    </div>
  );
};
