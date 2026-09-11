import React from 'react';
import { CloudSun, CalendarDays, Gauge, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MobileTab } from '../types';
import { LanguageCode } from '../utils/translations';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  language?: LanguageCode;
}

const TAB_LABELS: Record<string, { today: string; forecast: string; intel: string; cities: string }> = {
  en: { today: 'Today', forecast: 'Forecast', intel: 'Air & Intel', cities: 'Cities' },
  hi: { today: 'आज', forecast: 'पूर्वानुमान', intel: 'एयर क्वालिटी', cities: 'महानगर' },
  mr: { today: 'आज', forecast: 'अंदाज', intel: 'हवा गुणवत्ता', cities: 'शहरे' },
  gu: { today: 'આજ', forecast: 'આગાહી', intel: 'હવા ગુણવત્તા', cities: 'શહેરો' },
  bn: { today: 'আজ', forecast: 'পূর্বাভাস', intel: 'বাতাসের মান', cities: 'শহরসমূহ' },
  ta: { today: 'இன்று', forecast: 'வானிலை', intel: 'காற்று தரம்', cities: 'நகரங்கள்' },
  te: { today: 'ఈరోజు', forecast: 'వాతావరణం', intel: 'గాలి నాణ్యత', cities: 'నగరాలు' },
  pa: { today: 'ਅੱਜ', forecast: 'ਭਵਿੱਖਬਾਣੀ', intel: 'ਹਵਾ ਗੁਣਵੱਤਾ', cities: 'ਸ਼ਹਿਰ' },
  es: { today: 'Hoy', forecast: 'Pronóstico', intel: 'Calidad Aire', cities: 'Ciudades' },
  fr: { today: 'Aujourd\'hui', forecast: 'Prévisions', intel: 'Qualité Air', cities: 'Villes' },
  de: { today: 'Heute', forecast: 'Vorhersage', intel: 'Luftqualität', cities: 'Städte' },
  ja: { today: '今日', forecast: '予報', intel: '大気質', cities: '都市' },
  ar: { today: 'اليوم', forecast: 'التوقعات', intel: 'جودة الهواء', cities: 'المدن' },
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  language = 'en',
}) => {
  const labels = TAB_LABELS[language] || TAB_LABELS.en;

  const tabs = [
    { id: 'today' as MobileTab, label: labels.today, icon: CloudSun },
    { id: 'forecast' as MobileTab, label: labels.forecast, icon: CalendarDays },
    { id: 'intel' as MobileTab, label: labels.intel, icon: Gauge },
    { id: 'cities' as MobileTab, label: labels.cities, icon: Building2 },
  ];

  return (
    <nav 
      id="app-bottom-navbar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#08152e]/92 backdrop-blur-2xl border-t border-white/[0.14] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(0,0,0,0.55)] transition-all"
      aria-label="Application Navigation"
    >
      <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-4 gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 active:scale-95 group touch-manipulation min-h-[56px]"
            >
              {/* Active Ambient Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-sky-400/10 to-amber-400/10 border border-sky-400/35 rounded-2xl -z-10 shadow-[0_0_18px_rgba(56,189,248,0.25)]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {/* Medium-Big Application Icon */}
              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-300 scale-110 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]' 
                      : 'text-white/45 group-hover:text-white/80 group-hover:scale-105'
                  }`} 
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
              </div>

              {/* App Label */}
              <span 
                className={`text-[11px] font-medium tracking-tight mt-1 transition-all truncate max-w-full ${
                  isActive 
                    ? 'text-amber-300 font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]' 
                    : 'text-white/50 group-hover:text-white/80'
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
