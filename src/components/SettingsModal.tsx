import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Check, 
  Settings as SettingsIcon, 
  RotateCcw,
  Sun,
  Moon,
  Thermometer,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LanguageCode, 
  AVAILABLE_LANGUAGES, 
  TRANSLATIONS,
  TranslationStrings 
} from '../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  unit: 'C' | 'F';
  onToggleUnit: (unit: 'C' | 'F') => void;
  skyTheme: 'blue-sky' | 'deep-indigo';
  onToggleTheme: (theme: 'blue-sky' | 'deep-indigo') => void;
  t: TranslationStrings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  unit,
  onToggleUnit,
  skyTheme,
  onToggleTheme,
  t
}) => {
  const [langSearch, setLangSearch] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0b1c3d]/95 border border-sky-400/25 rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(2,12,38,0.75)] text-white overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                <SettingsIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {t.settingsTitle}
                </h3>
                <p className="text-[11px] text-sky-200/60">
                  {t.languageDesc}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              title={t.closeBtn}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Settings Body */}
          <div className="overflow-y-auto no-scrollbar space-y-5 pr-1 flex-1">
            {/* Quick Preferences: Unit & Theme */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Unit selector */}
              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-sky-200/70 text-[11px] font-medium mb-2">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.tempUnitLabel}</span>
                </div>
                <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => onToggleUnit('C')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      unit === 'C'
                        ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    °C Celsius
                  </button>
                  <button
                    onClick={() => onToggleUnit('F')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      unit === 'F'
                        ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    °F Fahrenheit
                  </button>
                </div>
              </div>

              {/* Theme selector */}
              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                <div className="flex items-center gap-1.5 text-sky-200/70 text-[11px] font-medium mb-2">
                  <Sun className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.themeLabel}</span>
                </div>
                <div className="flex bg-black/25 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => onToggleTheme('blue-sky')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      skyTheme === 'blue-sky'
                        ? 'bg-amber-400/25 text-amber-200 border border-amber-300/50 shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Morning Sky</span>
                  </button>
                  <button
                    onClick={() => onToggleTheme('deep-indigo')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      skyTheme === 'deep-indigo'
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Dark Neon</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Language Section Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.languageLabel}</span>
                </div>

                {currentLanguage !== 'en' && (
                  <button
                    onClick={() => onSelectLanguage('en')}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.resetEnglishBtn}</span>
                  </button>
                )}
              </div>

              {/* Language Search */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  placeholder="Filter languages..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400/50 transition-all"
                />
              </div>

              {/* Grid of Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredLanguages.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => onSelectLanguage(lang.code)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-sky-500/25 border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold leading-snug truncate ${isSelected ? 'text-sky-100' : 'text-white/90'}`}>
                          {lang.nativeName}
                        </p>
                        <p className="text-[10px] text-sky-200/50">
                          {lang.name} {lang.code === 'en' ? '• Default' : ''}
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-sky-200/50">
              Active: <span className="text-amber-300 font-semibold">{AVAILABLE_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-amber-400 hover:from-sky-300 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              {t.closeBtn}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
