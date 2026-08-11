import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-lg">
              <Tractor className="w-5 h-5 text-emerald-400" />
              <span>{t('app_name')}</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              {t('tagline')}. {language === 'kn' ? 'ಕರ್ನಾಟಕದ ರೈತರಿಗಾಗಿ ಆಧುನಿಕ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಬುಕಿಂಗ್ ಪೋರ್ಟಲ್.' : 'Modern agricultural equipment booking platform with transparent pricing and GPS field tracking.'}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{language === 'kn' ? 'ಪೋರ್ಟಲ್‌ಗಳು' : 'Roles & Portals'}</h4>
            <ul className="space-y-2 text-xs">
              <li>👨‍🌾 {t('roles.farmer')}</li>
              <li>🚜 {t('roles.owner')}</li>
              <li>⚙️ {language === 'kn' ? 'ಎಕರೆ ಆಧಾರಿತ ಪಾರದರ್ಶಕ ಬಿಲ್ಲಿಂಗ್' : 'Transparent Acreage Billing'}</li>
              <li>📅 {language === 'kn' ? 'ಸುಧಾರಿತ ಕ್ಯಾಲೆಂಡರ್ ಬುಕಿಂಗ್' : 'Advanced Calendar Scheduling'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{language === 'kn' ? 'ಲಭ್ಯವಿರುವ ಉಪಕರಣಗಳು' : 'Equipment Types'}</h4>
            <ul className="space-y-2 text-xs">
              <li>🚜 John Deere & Mahindra Tractors</li>
              <li>🌾 High-Capacity Paddy Harvesters</li>
              <li>⚙️ Heavy-Duty Rotavators</li>
              <li>💧 Fieldking Boom Sprayers</li>
              <li>🌱 Automatic 9-Row Seed Drills</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold mb-3">{t('kisan_helpline')}</h4>
            <div className="bg-slate-900 border border-white/10 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <PhoneCall className="w-4 h-4" />
                <span>1800-RURAL-MACH (Toll-Free)</span>
              </div>
              <p className="text-[11px] text-slate-500">{t('kisan_support_info')}</p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© 2026 {t('app_name')}. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Government Compliance (Karnataka)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
