import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { LocationSearch, LocationData } from '../../components/location/LocationSearch';
import { Tractor, Phone, MapPin, Globe, Camera, Save, ArrowLeft, Building2 } from 'lucide-react';

interface OwnerProfileProps {
  onNavigate: (route: string) => void;
}

export const OwnerProfile: React.FC<OwnerProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [village, setVillage] = useState(user?.village || 'Hoskote');
  const [taluk, setTaluk] = useState(user?.taluk || 'Hoskote');
  const [district, setDistrict] = useState(user?.district || 'Bengaluru Rural');
  const [address, setAddress] = useState(user?.address || 'Kisan Machinery Hub, Industrial Area');
  const [businessName, setBusinessName] = useState(user?.business_name || 'Sri Manjunatha Krishi Seva');
  const [latitude, setLatitude] = useState<number | undefined>(user?.latitude || 13.0755);
  const [longitude, setLongitude] = useState<number | undefined>(user?.longitude || 77.8015);
  const [prefLang, setPrefLang] = useState<'en' | 'kn'>(language);
  const [profileImage, setProfileImage] = useState(user?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setVillage(user.village);
      setTaluk(user.taluk || user.village);
      setDistrict(user.district);
      if (user.address) setAddress(user.address);
      if (user.business_name) setBusinessName(user.business_name);
      if (user.latitude) setLatitude(user.latitude);
      if (user.longitude) setLongitude(user.longitude);
      if (user.preferred_language) setPrefLang(user.preferred_language as 'en' | 'kn');
      if (user.profile_image) setProfileImage(user.profile_image);
    }
  }, [user]);

  const handleLocationSelect = (loc: LocationData) => {
    setVillage(loc.village);
    setTaluk(loc.taluk);
    setDistrict(loc.district);
    setAddress(loc.formattedAddress);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    showToast(`Location updated to ${loc.village}, ${loc.district}`, 'success');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !village || !taluk || !district) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('rmb_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          village,
          taluk,
          district,
          address,
          latitude,
          longitude,
          business_name: businessName,
          preferred_language: prefLang,
          profile_image: profileImage
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(t('profile.save_changes') + ' - Success!', 'success');
        setLanguage(prefLang);
      } else {
        showToast(data.error || 'Failed to update profile.', 'error');
      }
    } catch (e) {
      showToast('Network error during profile update.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back to Dashboard */}
      <button
        onClick={() => onNavigate('/dashboard/owner')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Owner Dashboard</span>
      </button>

      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={profileImage}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1.5 rounded-lg shadow font-bold">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Machinery Owner Profile
            </span>
            <h1 className="text-2xl font-black text-white mt-1">{name || 'Owner'}</h1>
            <p className="text-xs text-slate-400">{businessName} • {phone} • {village}</p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Role</span>
          <span className="bg-amber-500/20 text-amber-300 font-extrabold px-3 py-1 rounded-xl border border-amber-500/30">
            🚜 MACHINERY OWNER
          </span>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 text-xs">
        
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-black text-white">{t('profile.owner_title')}</h2>
          <p className="text-slate-400 text-xs mt-0.5">{t('profile.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.full_name')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.phone')}</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">{t('auth.business_name')}</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-white font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder="e.g. Sri Manjunatha Agricultural Machinery Works"
            />
          </div>
        </div>

        {/* Google Maps Location Search Component */}
        <div className="border-t border-white/10 pt-4">
          <LocationSearch
            initialLocation={{ village, taluk, district, formattedAddress: address, latitude, longitude }}
            onLocationSelect={handleLocationSelect}
            placeholder="Search equipment hub, village, or taluk across Karnataka..."
            label={t('profile.location_search_label')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.village')}</label>
            <input
              type="text"
              required
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.taluk')}</label>
            <input
              type="text"
              required
              value={taluk}
              onChange={(e) => setTaluk(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.district')}</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">{t('auth.address')}</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-semibold"
            placeholder="Workshop / Garage Address, Plot No, Landmark"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('auth.preferred_language')}</label>
            <select
              value={prefLang}
              onChange={(e) => setPrefLang(e.target.value as 'en' | 'kn')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-semibold"
            >
              <option value="en">English</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">{t('profile.profile_photo')} (URL)</label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-semibold"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/owner')}
            className="w-1/2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-2xl border border-white/10 cursor-pointer"
          >
            {t('profile.cancel')}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-1/2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 text-slate-950 font-black py-3 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : t('profile.save_changes')}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
