import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-slate-900 border border-white/10 rounded-2xl p-1 shadow-inner text-xs">
      <div className="px-2 text-slate-400 flex items-center space-x-1 hidden sm:flex">
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
          language === 'en'
            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('kn')}
        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer font-kannada ${
          language === 'kn'
            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};
