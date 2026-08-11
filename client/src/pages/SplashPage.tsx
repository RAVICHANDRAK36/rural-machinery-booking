import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Clock, MapPin, IndianRupee, Users } from 'lucide-react';

interface SplashPageProps {
  onNavigate: (route: string) => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="relative overflow-hidden pt-8 pb-20 space-y-24">
      
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 pt-8">
        
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest glow-emerald">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('app_name')}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {language === 'kn' ? (
            <>
              ಪ್ರತಿಯೊಬ್ಬ ರೈತರಿಗೂ ಸುಲಭ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                ಕೃಷಿ ಯಂತ್ರೋಪಕರಣ ಲಭ್ಯತೆ.
              </span>
            </>
          ) : (
            <>
              Smart Equipment Access for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Every Farmer.
              </span>
            </>
          )}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {language === 'kn'
            ? 'ಟ್ರ್ಯಾಕ್ಟರ್, ಕಟಾವು ಯಂತ್ರ, ರೋಟವೇಟರ್ ಮತ್ತು ಸಿಂಪಡಕಗಳನ್ನು ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ. ಪಾರದರ್ಶಕ ದರಗಳು, ಪರಿಶೀಲಿಸಿದ ಮಾಲೀಕರು ಮತ್ತು ಸುಧಾರಿತ ಕ್ಯಾಲೆಂಡರ್ ಬುಕಿಂಗ್.'
            : 'Book tractors, harvesters, rotavators, and sprayers directly without endless phone calls. Transparent pricing, verified owners, and advanced calendar scheduling.'
          }
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('/select-role')}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm px-9 py-4 rounded-2xl shadow-xl shadow-emerald-950/60 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer glow-emerald"
          >
            <span>{t('nav.select_role')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/auth/login')}
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-sm px-8 py-4 rounded-2xl transition hover:scale-105 cursor-pointer"
          >
            {t('nav.login')}
          </button>
        </div>

        {/* Live Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
          <div className="glass-panel p-5 rounded-3xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'kn' ? 'ಉಳುಮೆ ಮಾಡಿದ ಭೂಮಿ' : 'Land Cultivated'}
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">2,850+ Acres</div>
            <p className="text-[11px] text-slate-500">{language === 'kn' ? 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed on time'}</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'kn' ? 'ನೋಂದಾಯಿತ ಯಂತ್ರಗಳು' : 'Verified Machinery'}
            </span>
            <div className="text-2xl font-black text-teal-400 mt-1">150+ Units</div>
            <p className="text-[11px] text-slate-500">{language === 'kn' ? 'ಟ್ರ್ಯಾಕ್ಟರ್ & ಕಟಾವು ಯಂತ್ರಗಳು' : 'Tractors & Harvesters'}</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'kn' ? 'ನೋಂದಾಯಿತ ರೈತರು' : 'Registered Farmers'}
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1">640+ Farmers</div>
            <p className="text-[11px] text-slate-500">{language === 'kn' ? '24+ ಗ್ರಾಮಗಳಾದ್ಯಂತ' : 'Across 24+ Villages'}</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'kn' ? 'ಆಗಮನದ ನಿಖರತೆ' : 'Arrival Reliability'}
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">98.4%</div>
            <p className="text-[11px] text-slate-500">{language === 'kn' ? 'ಜಿಪಿಎಸ್ ಪರಿಶೀಲಿತ ಆಗಮನ' : 'GPS verified arrival'}</p>
          </div>
        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            {language === 'kn' ? 'ವಿಶೇಷತೆಗಳು' : 'WHY RURAL MACHINERY?'}
          </span>
          <h2 className="text-3xl font-black text-white mt-2">
            {language === 'kn' ? 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಕೃಷಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ' : 'Engineered for Indian Rural Agriculture'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">
              {language === 'kn' ? 'ಪಾರದರ್ಶಕ ಎಕರೆ ದರಗಳು' : 'Transparent Acreage Pricing'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'kn'
                ? 'ಯಾವುದೇ ಗುಪ್ತ ಕಮಿಷನ್ ಶುಲ್ಕಗಳಿಲ್ಲ. ಮಾಲೀಕರು ನೇರವಾಗಿ ಎಕರೆ ಮತ್ತು ಗಂಟೆಯ ದರಗಳನ್ನು ನಿಗದಿಪಡಿಸುತ್ತಾರೆ.'
                : 'No hidden broker fees or post-work bargaining. Owners set clear fixed rates per acre and per hour.'}
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 hover:border-teal-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">
              {language === 'kn' ? 'ವಾರದ ನಿರ್ವಹಣಾ ತಡೆ ರಕ್ಷಣೆ' : 'Weekly Maintenance Guard'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'kn'
                ? 'ಯಂತ್ರದ ನಿರ್ವಹಣಾ ದಿನಗಳು ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿರ್ಬಂಧಿಸಲ್ಪಡುತ್ತವೆ, ಬುಕಿಂಗ್ ವಿಳಂಬವನ್ನು ತಡೆಯುತ್ತವೆ.'
                : 'Machine maintenance schedules automatically lock time slots, ensuring high reliability in the field.'}
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">
              {language === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ಮಾಲೀಕರ ಜಾಲ' : 'Verified Owner Network'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'kn'
                ? 'ಎಲ್ಲಾ ಯಂತ್ರ ಮಾಲೀಕರು ಮತ್ತು ಉಪಕರಣ ನೋಂದಣಿ ಸಂಖ್ಯೆಗಳು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.'
                : 'All machinery owners and equipment registration numbers are verified on the portal.'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
