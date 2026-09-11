import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { D3ClimateChart } from './D3ClimateChart';
import { getCityClimateProfile } from '../utils/climateData';
import { ChartViewMode } from '../types';
import { Clock, Calendar, CalendarRange, SunSnow, History } from 'lucide-react';

interface TemperatureChartProps {
  data?: any[];
  forecastData?: any[];
  type?: ChartViewMode;
  unit?: 'C' | 'F';
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
  onModeChange?: (mode: ChartViewMode) => void;
  showModeSelector?: boolean;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ 
  data = [], 
  forecastData = [],
  type = 'hourly',
  unit = 'C',
  city = 'New Delhi',
  country = 'India',
  lat = 28.61,
  lon = 77.20,
  onModeChange,
  showModeSelector = true,
}) => {
  const [currentMode, setCurrentMode] = useState<ChartViewMode>(type);

  // Synchronize internal state with external prop change
  useEffect(() => {
    if (type) {
      setCurrentMode(type);
    }
  }, [type]);

  const handleModeSelect = (mode: ChartViewMode) => {
    setCurrentMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  const toUnit = (c: number) => (unit === 'C' ? Math.round(c) : Math.round((c * 9) / 5 + 32));

  // Compute 30-year climatological profile for monthly & seasonal D3 visualizations
  const climateProfile = useMemo(() => {
    return getCityClimateProfile(city, country, lat, lon);
  }, [city, country, lat, lon]);

  // Hourly or Daily chart data for Recharts
  const chartData = useMemo(() => {
    if (currentMode === 'hourly') {
      const source = data.length > 0 ? data : (forecastData[0]?.hour || []);
      return source.filter((_: any, i: number) => i % 2 === 0).map((h: any) => ({
        time: new Date(h.time).getHours() + ":00",
        temp: toUnit(h.temp_c),
        precip: (h.chance_of_rain || 0) > (h.chance_of_snow || 0) 
          ? (h.chance_of_rain || 0) 
          : (h.chance_of_snow || 0),
      }));
    } else if (currentMode === 'daily') {
      const source = forecastData.length > 0 ? forecastData : data;
      return source.map((d: any) => ({
        time: d.date ? new Date(d.date).toLocaleDateString([], { weekday: 'short' }) : 'Day',
        temp: toUnit(d.day?.maxtemp_c ?? d.temp_c ?? 20),
        precip: ((d.day?.daily_chance_of_rain || 0) > (d.day?.daily_chance_of_snow || 0) 
          ? (d.day?.daily_chance_of_rain || 0) 
          : (d.day?.daily_chance_of_snow || 0)),
      }));
    }
    return [];
  }, [currentMode, data, forecastData, unit]);

  return (
    <div id="temperature-chart-root" className="w-full">
      {/* Top Header Controls: Mode Selector Buttons */}
      {showModeSelector && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
          <div className="flex items-center gap-1 text-[11px] font-bold text-white/50">
            {currentMode === 'hourly' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
            {currentMode === 'daily' && <Calendar className="w-3.5 h-3.5 text-amber-400" />}
            {currentMode === 'monthly' && <CalendarRange className="w-3.5 h-3.5 text-amber-400" />}
            {currentMode === 'seasonal' && <SunSnow className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-white/80 uppercase tracking-wider font-extrabold text-[10px]">
              {currentMode === 'hourly' && '24-Hour Forecast'}
              {currentMode === 'daily' && '7-Day Outlook'}
              {currentMode === 'monthly' && `Monthly Normals • ${city}`}
              {currentMode === 'seasonal' && `Seasonal Climate Trends • ${city}`}
            </span>
          </div>

          <div 
            id="chart-mode-pill-group"
            className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10 text-[11px] backdrop-blur-md"
          >
            <button
              id="chart-mode-btn-hourly"
              type="button"
              onClick={() => handleModeSelect('hourly')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentMode === 'hourly'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_2px_10px_rgba(251,191,36,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Hourly
            </button>
            <button
              id="chart-mode-btn-daily"
              type="button"
              onClick={() => handleModeSelect('daily')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentMode === 'daily'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_2px_10px_rgba(251,191,36,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Daily
            </button>
            <button
              id="chart-mode-btn-monthly"
              type="button"
              onClick={() => handleModeSelect('monthly')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentMode === 'monthly'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_2px_10px_rgba(251,191,36,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Monthly
            </button>
            <button
              id="chart-mode-btn-seasonal"
              type="button"
              onClick={() => handleModeSelect('seasonal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentMode === 'seasonal'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_2px_10px_rgba(251,191,36,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Seasonal
            </button>
          </div>
        </div>
      )}

      {/* RENDER D3 HISTORICAL CLIMATE VISUALIZATION when in 'monthly' or 'seasonal' mode */}
      {(currentMode === 'monthly' || currentMode === 'seasonal') ? (
        <div className="w-full mt-1">
          <D3ClimateChart 
            climateProfile={climateProfile}
            mode={currentMode}
            unit={unit}
          />
        </div>
      ) : (
        /* RENDER RECHARTS COMPOSED CHART for 'hourly' or 'daily' view */
        <div className="h-44 md:h-48 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facd15" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#facd15" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 11, 51, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '1rem',
                  color: '#fff',
                  fontSize: '12px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                cursor={{ stroke: 'rgba(255, 255, 255, 0.15)', strokeWidth: 1.5 }}
              />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                hide 
                domain={['dataMin - 3', 'dataMax + 3']} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                hide 
                domain={[0, 100]}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="temp" 
                name={`Temp (°${unit})`}
                stroke="#facd15" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
              />
              <Bar 
                yAxisId="right"
                dataKey="precip" 
                name="Precip (%)"
                fill="#38bdf8" 
                radius={[4, 4, 0, 0]}
                opacity={0.35}
                barSize={12}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
