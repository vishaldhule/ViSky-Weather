import React from 'react';
import { motion } from 'motion/react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  appName?: string;
  onClick?: () => void;
}

export const AppLogoIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 38,
  className = "" 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative shrink-0 select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_14px_rgba(2,132,199,0.45)] group-hover:drop-shadow-[0_6px_20px_rgba(0,180,216,0.6)] transition-all duration-300"
      >
        <defs>
          <linearGradient id="indra-icon-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="50%" stopColor="#0077b6" />
            <stop offset="100%" stopColor="#023e8a" />
          </linearGradient>
          <linearGradient id="indra-sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffde59" />
            <stop offset="100%" stopColor="#fb8500" />
          </linearGradient>
          <linearGradient id="indra-lightning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffea79" />
            <stop offset="100%" stopColor="#ffb703" />
          </linearGradient>
          <filter id="indra-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#001a40" floodOpacity="0.4" />
          </filter>
          <filter id="indra-cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#002452" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Squircle App Badge with glow */}
        <rect 
          x="4" 
          y="4" 
          width="92" 
          height="92" 
          rx="22" 
          fill="url(#indra-icon-bg)" 
          filter="url(#indra-shadow)" 
        />
        
        {/* Subtle Top-Glass Highlight */}
        <rect 
          x="6" 
          y="6" 
          width="88" 
          height="42" 
          rx="18" 
          fill="#FFFFFF" 
          fillOpacity="0.16" 
        />

        {/* Sun (with gentle rotation and scale pulse) */}
        <circle 
          cx="66" 
          cy="38" 
          r="15" 
          fill="url(#indra-sun)" 
          className="origin-[66px_38px] animate-[pulse_3s_ease-in-out_infinite]"
        />

        {/* Fluffy White Cloud (gentle floating drift animation) */}
        <g 
          filter="url(#indra-cloud-shadow)"
          className="transition-transform duration-700 ease-in-out group-hover:-translate-y-0.5 group-hover:scale-[1.02] origin-center"
        >
          <rect x="24" y="46" width="52" height="22" rx="11" fill="#FFFFFF" />
          <circle cx="36" cy="50" r="13" fill="#FFFFFF" />
          <circle cx="50" cy="42" r="17" fill="#FFFFFF" />
          <circle cx="64" cy="51" r="12" fill="#FFFFFF" />
        </g>

        {/* Golden Lightning Bolt (with lively energetic glow) */}
        <path 
          d="M49 57 L44 68 L50 68 L46 81 L57 66 L51 66 Z" 
          fill="url(#indra-lightning)" 
          stroke="#d97706" 
          strokeWidth="0.8" 
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        />
      </svg>
    </motion.div>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  appName = "INDRA",
  onClick,
}) => {
  const pixelSize = size === "sm" ? 30 : size === "lg" ? 46 : 38;

  return (
    <motion.div 
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex items-center gap-2 select-none cursor-pointer group ${className}`}
    >
      <AppLogoIcon size={pixelSize} />
      
      {showText && (
        <div className="hidden sm:flex flex-col justify-center leading-tight">
          <span className="text-sm sm:text-base font-black tracking-wider text-white group-hover:text-cyan-200 transition-colors drop-shadow-sm font-sans uppercase">
            {appName}
          </span>
          <span className="text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.2em] text-[#00d4ff] group-hover:text-cyan-300 uppercase mt-0.5 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-colors">
            WEATHER FORECAST
          </span>
        </div>
      )}
    </motion.div>
  );
};
