import React from 'react';
import { CloudSun, CalendarDays, Gauge, Building2, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { MobileTab } from '../types';
import { LanguageCode } from '../utils/translations';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  language?: LanguageCode;
  isNight?: boolean;
}

const TAB_LABELS: Record<string, { today: string; forecast: string; intel: string; cities: string; settings: string }> = {
  en: { today: 'Today', forecast: 'Forecast', intel: 'Air Intel', cities: 'Cities', settings: 'Settings' },
  hi: { today: 'आज', forecast: 'पूर्वानुमान', intel: 'एयर क्वालिटी', cities: 'महानगर', settings: 'सेटिंग्स' },
  mr: { today: 'आज', forecast: 'अंदाज', intel: 'हवा गुणवत्ता', cities: 'शहरे', settings: 'सेटिंग्ज' },
  gu: { today: 'આજ', forecast: 'આગાહી', intel: 'હવા ગુણવત્તા', cities: 'શહેરો', settings: 'સેટિંગ્સ' },
  bn: { today: 'আজ', forecast: 'পূর্বাভাস', intel: 'বাতাসের মান', cities: 'শহরসমূহ', settings: 'সেটিংস' },
  ta: { today: 'இன்று', forecast: 'வானிலை', intel: 'காற்று தரம்', cities: 'நகரங்கள்', settings: 'அமைப்புகள்' },
  te: { today: 'ఈరోజు', forecast: 'వాతావరణం', intel: 'గాలి నాణ్యత', cities: 'నగరాలు', settings: 'సెట్టింగ్‌లు' },
  pa: { today: 'ਅੱਜ', forecast: 'ਭਵਿੱਖਬਾਣੀ', intel: 'ਹਵਾ ਗੁਣਵੱਤਾ', cities: 'ਸ਼ਹਿਰ', settings: 'ਸੈਟਿੰਗਾਂ' },
  es: { today: 'Hoy', forecast: 'Pronóstico', intel: 'Calidad Aire', cities: 'Ciudades', settings: 'Ajustes' },
  fr: { today: 'Aujourd\'hui', forecast: 'Prévisions', intel: 'Qualité Air', cities: 'Villes', settings: 'Paramètres' },
  de: { today: 'Heute', forecast: 'Vorhersage', intel: 'Luftqualität', cities: 'Städte', settings: 'Einstellungen' },
  ja: { today: '今日', forecast: '予報', intel: '大気質', cities: '都市', settings: '設定' },
  ar: { today: 'اليوم', forecast: 'التوقعات', intel: 'جودة الهواء', cities: 'المدن', settings: 'الإعدادات' },
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  language = 'en',
  isNight = false,
}) => {
  const labels = TAB_LABELS[language] || TAB_LABELS.en;

  const tabs = [
    { id: 'today' as MobileTab, label: labels.today, icon: CloudSun },
    { id: 'forecast' as MobileTab, label: labels.forecast, icon: CalendarDays },
    { id: 'intel' as MobileTab, label: labels.intel, icon: Gauge },
    { id: 'cities' as MobileTab, label: labels.cities, icon: Building2 },
    { id: 'settings' as MobileTab, label: labels.settings, icon: Settings },
  ];

  return (
    <nav 
      id="app-bottom-navbar"
      className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md px-1 sm:px-4 pt-1 sm:pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] transition-colors ${
        isNight 
          ? 'bg-[#040816]/96 border-t border-white/[0.10] shadow-[0_-8px_32px_rgba(0,0,0,0.7)]' 
          : 'bg-[#0b2248]/96 border-t border-white/[0.12] shadow-[0_-8px_32px_rgba(0,0,0,0.4)]'
      }`}
      aria-label="Application Navigation"
    >
      <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-5 gap-0.5 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl transition-all duration-200 active:scale-95 group touch-manipulation min-h-[46px] sm:min-h-[52px]"
            >
              {/* Active Ambient Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl -z-10 border ${
                    isNight
                      ? 'bg-gradient-to-b from-sky-400/20 via-sky-400/10 to-indigo-500/15 border-sky-400/35 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-gradient-to-b from-amber-400/20 via-white/10 to-sky-400/15 border-amber-300/40 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                  }`}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {/* Application Icon */}
              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 transition-all duration-200 ${
                    isActive 
                      ? isNight 
                        ? 'text-sky-300 scale-105 sm:scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' 
                        : 'text-amber-200 scale-105 sm:scale-110 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]'
                      : 'text-white/50 group-hover:text-white/85 group-hover:scale-105'
                  }`} 
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
              </div>

              {/* App Label */}
              <span 
                className={`text-[9.5px] sm:text-[11px] font-medium tracking-tight mt-0.5 sm:mt-1 transition-all truncate max-w-full leading-none ${
                  isActive 
                    ? isNight 
                      ? 'text-sky-300 font-bold drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]' 
                      : 'text-amber-200 font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                    : 'text-white/55 group-hover:text-white/85'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

