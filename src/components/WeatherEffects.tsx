import React from 'react';

// Soft Puffy Realistic Cloud SVG for Morning/Day Sky (Delicate & Low Contrast to protect readability)
const MorningCloud: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  opacity?: number;
  idPrefix?: string;
}> = ({ 
  className = "", 
  width = 280, 
  height = 110, 
  opacity = 0.6, 
  idPrefix = 'c1'
}) => {
  return (
    <svg
      viewBox="0 0 280 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height, opacity }}
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id={`${idPrefix}-cloud-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#f8fafc" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id={`${idPrefix}-rim-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Cloud Billowing Puffs with soft ambient shadow */}
      <g filter="drop-shadow(0 4px 14px rgba(0,0,0,0.18))">
        {/* Base Pill */}
        <rect x="30" y="48" width="220" height="46" rx="23" fill={`url(#${idPrefix}-cloud-grad)`} />
        
        {/* Puffs */}
        <circle cx="75" cy="54" r="30" fill={`url(#${idPrefix}-cloud-grad)`} />
        <circle cx="125" cy="40" r="38" fill={`url(#${idPrefix}-cloud-grad)`} />
        <circle cx="175" cy="46" r="33" fill={`url(#${idPrefix}-cloud-grad)`} />
        <circle cx="215" cy="58" r="25" fill={`url(#${idPrefix}-cloud-grad)`} />

        {/* Soft top sunlight highlight */}
        <path 
          d="M 52 48 Q 75 24, 105 32 Q 125 6, 158 18 Q 175 16, 202 32 Q 225 38, 238 58" 
          stroke={`url(#${idPrefix}-rim-grad)`} 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          opacity="0.8"
        />
      </g>
    </svg>
  );
};

// Atmospheric Misty Nocturnal Fog Cloud (Soft, Diffuse, Non-Neon "Fog" Style)
const MistyNightFog: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  opacity?: number;
}> = ({ 
  className = "", 
  width = 320, 
  height = 90, 
  opacity = 0.5 
}) => {
  return (
    <div 
      className={`pointer-events-none select-none relative ${className}`}
      style={{ width, height, opacity }}
    >
      {/* Soft Gaussian-blurred mist banks blending naturally into the night */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(148, 163, 184, 0.28) 0%, rgba(100, 116, 139, 0.16) 45%, rgba(51, 65, 85, 0.08) 75%, transparent 100%)',
        }}
      />
      {/* Second overlapping fog puff for organic mist depth */}
      <div 
        className="absolute top-2 left-6 w-3/5 h-4/5 rounded-full blur-xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(203, 213, 225, 0.22) 0%, rgba(148, 163, 184, 0.12) 50%, transparent 85%)',
        }}
      />
      {/* Third trailing mist wisps */}
      <div 
        className="absolute bottom-1 right-8 w-1/2 h-3/4 rounded-full blur-xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(148, 163, 184, 0.18) 0%, rgba(71, 85, 105, 0.1) 60%, transparent 90%)',
        }}
      />
    </div>
  );
};

// Fixed star coordinates to eliminate Math.random() re-renders
const STAR_DATA = [
  { top: '6%', left: '8%', delay: '0.2s', size: 2 },
  { top: '12%', left: '22%', delay: '1.4s', size: 1.5 },
  { top: '8%', left: '42%', delay: '2.1s', size: 2 },
  { top: '15%', left: '60%', delay: '0.7s', size: 1.5 },
  { top: '5%', left: '78%', delay: '1.8s', size: 2.5 },
  { top: '20%', left: '92%', delay: '2.5s', size: 1.5 },
  { top: '26%', left: '14%', delay: '1.1s', size: 1.5 },
  { top: '34%', left: '32%', delay: '2.8s', size: 2 },
  { top: '28%', left: '48%', delay: '0.5s', size: 2 },
  { top: '36%', left: '70%', delay: '1.9s', size: 1.5 },
  { top: '42%', left: '88%', delay: '0.3s', size: 2 },
  { top: '50%', left: '6%', delay: '2.2s', size: 1.5 },
  { top: '56%', left: '25%', delay: '1.3s', size: 2 },
  { top: '62%', left: '52%', delay: '0.8s', size: 1.5 },
  { top: '68%', left: '82%', delay: '2.4s', size: 2 },
  { top: '75%', left: '18%', delay: '1.7s', size: 1.5 },
  { top: '82%', left: '65%', delay: '0.9s', size: 2 },
  { top: '88%', left: '90%', delay: '2.0s', size: 1.5 },
];

interface WeatherEffectsProps {
  condition: string;
  isNight?: boolean;
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ 
  condition,
  isNight = false
}) => {
  const c = condition.toLowerCase();
  const isRain = c.includes("rain") || c.includes("drizzle") || c.includes("shower");
  const isThunder = c.includes("thunder") || c.includes("storm") || c.includes("lightning");
  const isSnow = c.includes("snow") || c.includes("ice") || c.includes("blizzard");
  const isCloudy = c.includes("cloud") || c.includes("overcast") || c.includes("mist") || c.includes("fog");

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" 
      style={{ contain: 'paint layout' }}
      aria-hidden="true"
    >
      {/* ======================= DAY MODE (BALANCED MORNING SKY & GENTLE CLOUDS) ======================= */}
      {!isNight && (
        <>
          {/* Gentle Morning Sun - calibrated for elegance and high text contrast */}
          <div className="absolute -top-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none transform-gpu opacity-80">
            {/* Soft Ambient Warm Glow */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(254, 240, 138, 0.12) 35%, transparent 70%)',
                animation: 'sunPulse 6s ease-in-out infinite',
              }}
            />

            {/* Sun Core with warm golden light (non-blinding) */}
            <div className="absolute top-14 right-14 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-white shadow-[0_0_40px_rgba(251,191,36,0.4)] opacity-90" />
          </div>

          {/* CLOUD LAYER 1: Upper Sky High-Altitude Soft Puffy Cloud */}
          <div
            className="absolute top-[4%] left-0"
            style={{
              animation: 'cloudDrift1 58s linear infinite',
              willChange: 'transform',
            }}
          >
            <MorningCloud 
              idPrefix="day-c1"
              width={250} 
              height={95} 
              opacity={isCloudy ? 0.75 : 0.55} 
            />
          </div>

          {/* CLOUD LAYER 2: Mid-Sky Gentle Fluffy Cloud (Pre-loaded with negative delay) */}
          <div
            className="absolute top-[18%] left-0"
            style={{
              animation: 'cloudDrift2 78s linear infinite -28s',
              willChange: 'transform',
            }}
          >
            <MorningCloud 
              idPrefix="day-c2"
              width={300} 
              height={115} 
              opacity={isCloudy ? 0.70 : 0.50} 
            />
          </div>

          {/* CLOUD LAYER 3: Lower-Altitude Background Cloud */}
          <div
            className="absolute top-[42%] left-0"
            style={{
              animation: 'cloudDrift3 96s linear infinite -52s',
              willChange: 'transform',
            }}
          >
            <MorningCloud 
              idPrefix="day-c3"
              width={220} 
              height={85} 
              opacity={isCloudy ? 0.60 : 0.40} 
            />
          </div>
        </>
      )}

      {/* ======================= NIGHT MODE (DARK CELESTIAL SKY & MISTY FOG CLOUDS) ======================= */}
      {isNight && (
        <>
          {/* Deep Ambient Space Atmosphere (Subtle & Natural, Non-harsh) */}
          <div 
            className="absolute -top-20 -left-16 w-[400px] h-[400px] rounded-full pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(30, 58, 138, 0.08) 50%, transparent 75%)',
            }}
          />

          {/* Gentle Twinkling Celestial Stars */}
          {STAR_DATA.map((star, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-slate-100"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animation: `starTwinkle 3.4s ease-in-out infinite`,
                animationDelay: star.delay,
                boxShadow: `0 0 ${star.size * 2}px rgba(241, 245, 249, 0.7)`,
              }}
            />
          ))}

          {/* Calm Natural Crescent Moon with soft pearl-silver glow */}
          <div className="absolute top-10 right-8 sm:right-16 w-18 h-18 sm:w-20 sm:h-20 pointer-events-none opacity-90">
            {/* Soft Moon Halo */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(248, 250, 252, 0.18) 0%, rgba(203, 213, 225, 0.08) 50%, transparent 75%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Silver Crescent Moon SVG (Natural, Elegant, Non-neon) */}
            <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-14 sm:h-14 relative z-10" fill="none">
              <path
                d="M48 32C48 45.2548 37.2548 56 24 56C19.826 56 15.9388 54.9318 12.5647 53.061C24.4961 49.3364 33.1429 38.1636 33.1429 24.8571C33.1429 17.5255 29.9806 10.932 24.966 6.35718C28.9172 5.48518 33.0232 5 37.2353 5C43.1812 5 48.7497 7.15174 53.061 10.7412C50.1444 16.9242 48 24.1685 48 32Z"
                fill="url(#moon-silver-grad)"
                stroke="#e2e8f0"
                strokeWidth="1"
                filter="drop-shadow(0 2px 10px rgba(255,255,255,0.3))"
              />
              <defs>
                <linearGradient id="moon-silver-grad" x1="12" y1="5" x2="53" y2="56">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* MISTY FOG BANK 1: Gentle nocturnal fog drifting softly in upper sky */}
          <div
            className="absolute top-[8%] left-0"
            style={{
              animation: 'fogDrift1 62s linear infinite -18s',
              willChange: 'transform',
            }}
          >
            <MistyNightFog 
              width={360} 
              height={95} 
              opacity={isCloudy ? 0.65 : 0.45} 
            />
          </div>

          {/* MISTY FOG BANK 2: Mid-sky subtle nocturnal mist bank */}
          <div
            className="absolute top-[26%] left-0"
            style={{
              animation: 'fogDrift2 84s linear infinite -42s',
              willChange: 'transform',
            }}
          >
            <MistyNightFog 
              width={420} 
              height={115} 
              opacity={isCloudy ? 0.55 : 0.38} 
            />
          </div>

          {/* MISTY FOG BANK 3: Lower-sky gentle rolling mist */}
          <div
            className="absolute top-[48%] left-0"
            style={{
              animation: 'fogDrift1 98s linear infinite -65s',
              willChange: 'transform',
            }}
          >
            <MistyNightFog 
              width={340} 
              height={85} 
              opacity={isCloudy ? 0.45 : 0.28} 
            />
          </div>
        </>
      )}

      {/* ======================= WEATHER PRECIPITATION OVERLAYS ======================= */}
      {/* Thunder Flash Ambient Glow */}
      {isThunder && (
        <div className={`absolute inset-0 opacity-0 animate-[pulse_3s_ease-in-out_infinite] ${
          isNight ? 'bg-indigo-300/15' : 'bg-sky-200/20'
        }`} />
      )}

      {/* Rain Droplets */}
      {isRain && (
        <div className="absolute inset-0 flex justify-around overflow-hidden">
          {[8, 22, 36, 50, 64, 78, 92, 16, 44, 72].map((pos, idx) => (
            <div
              key={idx}
              className={`w-[1.5px] h-16 ${
                isNight 
                  ? 'bg-gradient-to-b from-transparent via-slate-300/50 to-indigo-400/60'
                  : 'bg-gradient-to-b from-transparent via-sky-200/70 to-blue-400/80'
              }`}
              style={{
                marginLeft: `${pos}%`,
                animation: `rainFall ${0.7 + (idx % 3) * 0.22}s linear infinite`,
                animationDelay: `${(idx * 0.16) % 1.4}s`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Particles */}
      {isSnow && (
        <div className="absolute inset-0 overflow-hidden">
          {[10, 25, 40, 55, 70, 85, 18, 48, 78, 92].map((pos, idx) => (
            <div
              key={idx}
              className="rounded-full w-2 h-2 bg-white/90"
              style={{
                position: 'absolute',
                left: `${pos}%`,
                animation: `snowFall ${3.2 + (idx % 3)}s ease-in-out infinite`,
                animationDelay: `${(idx * 0.35) % 2.8}s`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
