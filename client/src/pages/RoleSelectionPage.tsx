import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Tractor, Users, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface RoleSelectionPageProps {
  onNavigate: (route: string) => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const roles = [
    {
      id: 'farmer',
      title: t('roles.farmer'),
      subtitle: t('roles.farmer_sub'),
      icon: Users,
      gradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
      border: 'hover:border-emerald-500/60',
      glow: 'glow-emerald',
      accent: 'bg-emerald-500 text-slate-950',
      bulletColor: 'text-emerald-400',
      features: language === 'kn' ? [
        'ಪರಿಶೀಲಿಸಿದ ಕೃಷಿ ಯಂತ್ರಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಬಾಡಿಗೆಗೆ ಪಡೆಯಿರಿ',
        'ಸುಧಾರಿತ ಕ್ಯಾಲೆಂಡರ್ ಮೂಲಕ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಬುಕಿಂಗ್',
        'ವಾರದ ನಿರ್ವಹಣಾ ದಿನಗಳ ತಡೆ ಮತ್ತು ಸುರಕ್ಷತೆ',
        'ಚಾಲಕ ಮತ್ತು ಮಾಲೀಕರ ಸಂಪರ್ಕ ಮತ್ತು ಬುಕಿಂಗ್ ಟ್ರ್ಯಾಕಿಂಗ್'
      ] : [
        'Browse & filter verified machinery',
        'Book machinery with advanced calendar',
        'Weekly maintenance conflict protection',
        'Track bookings & arrival contact'
      ],
      buttonText: t('roles.farmer_btn'),
      buttonClass: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
    },
    {
      id: 'owner',
      title: t('roles.owner'),
      subtitle: t('roles.owner_sub'),
      icon: Tractor,
      gradient: 'from-amber-950/70 via-slate-900 to-slate-950',
      border: 'hover:border-amber-500/60',
      glow: 'glow-amber',
      accent: 'bg-amber-400 text-slate-950',
      bulletColor: 'text-amber-400',
      features: language === 'kn' ? [
        'ನೋಂದಣಿ ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಹೊಸ ಕೃಷಿ ಯಂತ್ರಗಳನ್ನು ಸೇರಿಸಿ',
        'ವಾರದ ನಿರ್ವಹಣಾ ದಿನದ ವೇಳಾಪಟ್ಟಿ ನಿರ್ವಹಣೆ',
        'ರೈತರಿಂದ ಬರುವ ಬುಕಿಂಗ್ ವಿನಂತಿಗಳನ್ನು ಸ್ವೀಕರಿಸಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ',
        'ದೈನಂದಿನ, ವಾರದ ಮತ್ತು ಮಾಸಿಕ ಗಳಿಕೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ'
      ] : [
        'Add machinery with registration numbers',
        'Manage weekly maintenance day schedule',
        'Approve or reject incoming booking requests',
        'Track daily, weekly & monthly earnings'
      ],
      buttonText: t('roles.owner_btn'),
      buttonClass: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('roles.step_1')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('roles.select_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {t('roles.select_subtitle')}
        </p>
      </div>

      {/* 2 Animated Role Cards Grid (Farmer & Owner Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className={`bg-gradient-to-b ${r.gradient} rounded-3xl p-8 border border-white/10 ${r.border} shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden`}
            >
              
              {/* Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${r.accent}`}>
                    {r.id.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white group-hover:text-emerald-300 transition">
                    {r.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">{r.subtitle}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 pt-2">
                  {r.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 ${r.bulletColor} shrink-0 mt-0.5`} />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => onNavigate(`/auth/login?role=${r.id}`)}
                  className={`w-full py-4 rounded-2xl font-black text-xs shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.02] ${r.buttonClass}`}
                >
                  <span>{r.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
