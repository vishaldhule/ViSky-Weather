import React from 'react';
import { 
  Navigation, 
  Bell, 
  BellOff, 
  RefreshCw, 
  MapPin, 
  Search,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileAppHeaderProps {
  locationName: string;
  countryName: string;
  tracking: boolean;
  onToggleTracking: () => void;
  notifPermission: string;
  onRequestNotif: () => void;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSearch: () => void;
  locationSource?: 'gps' | 'network' | 'saved' | 'search';
}

export const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  locationName,
  countryName,
  tracking,
  onToggleTracking,
  notifPermission,
  onRequestNotif,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  onOpenSearch,
  locationSource,
}) => {
  return (
    <header 
      id="mobile-app-header"
      className="sticky top-0 z-30 bg-[#110B33]/85 backdrop-blur-2xl border-b border-white/10 px-3 py-2.5 md:py-3 transition-all"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand / Current Location badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-400/30 flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
          </div>
          <div className="min-w-0 cursor-pointer" onClick={onOpenSearch} title="Tap to change city or detect GPS">
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-black tracking-tight uppercase truncate">
                {locationName || "Indra"}
              </span>
              <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              {(tracking || locationSource === 'gps') && (
                <span className="px-1.5 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 text-[9px] font-black uppercase tracking-wider border border-yellow-400/40 animate-pulse">
                  GPS
                </span>
              )}
            </div>
            <p className="text-[8px] md:text-[10px] font-bold text-white/40 tracking-widest uppercase truncate">
              {countryName || "Weather App"}
            </p>
          </div>
        </div>

        {/* Right: Quick Mobile Action Controls */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Unit Toggle °C / °F */}
          <button
            id="unit-toggle-btn"
            onClick={onToggleUnit}
            className="h-8 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-black transition-all flex items-center justify-center text-yellow-400"
            title="Switch Temperature Unit"
          >
            °{unit}
          </button>

          {/* Search Trigger (Mobile icon) */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all md:hidden"
            title="Search Location"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Refresh button */}
          <button
            id="mobile-refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRefreshing ? 'animate-spin text-yellow-400' : ''}`} />
          </button>

          {/* GPS Tracking Toggle */}
          <button
            id="mobile-gps-btn"
            onClick={onToggleTracking}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
              tracking 
                ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.25)]' 
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white/80'
            }`}
            title="Live Location Tracking"
          >
            <Navigation className={`w-3.5 h-3.5 md:w-4 md:h-4 rotate-45 ${tracking ? 'animate-pulse' : ''}`} />
          </button>

          {/* Notification Alerts */}
          <button
            id="mobile-alerts-btn"
            onClick={onRequestNotif}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
              notifPermission === 'granted'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white/80'
            }`}
            title="Severe Weather Notifications"
          >
            {notifPermission === 'granted' ? (
              <Bell className="w-3.5 h-3.5 md:w-4 md:h-4" />
            ) : (
              <BellOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />
        </div>
      </div>
    </header>
  );
};
