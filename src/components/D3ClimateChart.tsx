import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CityClimateProfile, MonthlyClimateData, SeasonalClimateData } from '../types';
import { formatTemp, formatPrecip } from '../utils/climateData';
import { Sparkles, Info } from 'lucide-react';

interface D3ClimateChartProps {
  climateProfile: CityClimateProfile;
  mode: 'monthly' | 'seasonal';
  unit: 'C' | 'F';
}

interface ClimateChartPoint {
  key: string;
  label: string;
  fullTitle: string;
  avgTemp: number;
  avgHigh: number;
  avgLow: number;
  recordHigh: number;
  recordLow: number;
  precipMm: number;
  rainyDays?: number;
  trend?: string;
  note?: string;
  raw: MonthlyClimateData | SeasonalClimateData;
}

interface ActiveTooltipData {
  title: string;
  subtitle?: string;
  avgTempC: number;
  avgHighC: number;
  avgLowC: number;
  recordHighC?: number;
  recordLowC?: number;
  precipMm: number;
  rainyDays?: number;
  trend?: string;
  note?: string;
  x: number;
  y: number;
}

export const D3ClimateChart: React.FC<D3ClimateChartProps> = ({
  climateProfile,
  mode,
  unit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [activeItem, setActiveItem] = useState<ActiveTooltipData | null>(null);

  // ResizeObserver for fluid responsive SVG sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const width = entries[0].contentRect.width;
      if (width > 0) {
        setContainerWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const height = 230;
  const margin = { top: 24, right: 28, bottom: 36, left: 38 };
  const innerWidth = Math.max(100, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Convert celsius to chosen unit
  const toUnit = (c: number) => (unit === 'C' ? c : (c * 9) / 5 + 32);

  // Prepare data points based on mode
  const dataPoints: ClimateChartPoint[] = useMemo(() => {
    if (mode === 'monthly') {
      return climateProfile.monthly.map((m) => ({
        key: m.month,
        label: m.month,
        fullTitle: m.fullName,
        avgTemp: toUnit(m.avgTempC),
        avgHigh: toUnit(m.avgHighC),
        avgLow: toUnit(m.avgLowC),
        recordHigh: toUnit(m.recordHighC),
        recordLow: toUnit(m.recordLowC),
        precipMm: m.precipMm,
        rainyDays: m.rainyDays,
        raw: m,
      }));
    } else {
      return climateProfile.seasonal.map((s) => ({
        key: s.season,
        label: s.season,
        fullTitle: `${s.season} (${s.months})`,
        avgTemp: toUnit(s.avgTempC),
        avgHigh: toUnit(s.avgHighC),
        avgLow: toUnit(s.avgLowC),
        recordHigh: toUnit(s.avgHighC + 7),
        recordLow: toUnit(s.avgLowC - 7),
        precipMm: s.precipMm,
        trend: s.historicalTrend,
        note: s.climateNote,
        raw: s,
      }));
    }
  }, [climateProfile, mode, unit]);

  // Render D3 Visualization
  useEffect(() => {
    if (!svgRef.current || dataPoints.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    // 1. Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(dataPoints.map((d) => d.key))
      .range([0, innerWidth])
      .padding(0.35);

    // Temperature domain with padding
    const allTemps = dataPoints.flatMap((d) => [d.avgLow, d.avgHigh]);
    const minCalculated = d3.min(allTemps);
    const maxCalculated = d3.max(allTemps);
    const minTemp = (minCalculated !== undefined ? minCalculated : 0) - 3;
    const maxTemp = (maxCalculated !== undefined ? maxCalculated : 30) + 3;

    const yScale = d3
      .scaleLinear()
      .domain([minTemp, maxTemp])
      .range([innerHeight, 0])
      .nice();

    // Precipitation scale (bars along the bottom)
    const maxPrecipVal = d3.max(dataPoints, (d: ClimateChartPoint) => d.precipMm);
    const maxPrecip = (maxPrecipVal !== undefined ? maxPrecipVal : 100);
    const yPrecipScale = d3
      .scaleLinear()
      .domain([0, maxPrecip * 1.35])
      .range([innerHeight, innerHeight * 0.42]);

    // 2. SVG Definitions: Gradients & Shadows
    const defs = svg.append('defs');

    // Temperature area gradient
    const tempGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-temp-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    tempGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fbbf24')
      .attr('stop-opacity', 0.35);

    tempGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#38bdf8')
      .attr('stop-opacity', 0.05);

    // Precipitation bar gradient
    const precipGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-precip-bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    precipGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#38bdf8')
      .attr('stop-opacity', 0.5);

    precipGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0284c7')
      .attr('stop-opacity', 0.15);

    // Glow filter
    const filter = defs
      .append('filter')
      .attr('id', 'd3-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 3. Subtle horizontal temperature grid lines
    const yTicks = yScale.ticks(5);
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d: number) => yScale(d))
      .attr('y2', (d: number) => yScale(d))
      .attr('stroke', 'rgba(255, 255, 255, 0.07)')
      .attr('stroke-dasharray', '3 3');

    // 4. Precipitation Bars
    const barWidth = mode === 'monthly' ? Math.max(10, Math.min(24, innerWidth / 22)) : 34;
    g.selectAll<SVGRectElement, ClimateChartPoint>('.precip-bar')
      .data(dataPoints)
      .enter()
      .append('rect')
      .attr('class', 'precip-bar')
      .attr('x', (d: ClimateChartPoint) => (xScale(d.key) || 0) - barWidth / 2)
      .attr('y', (d: ClimateChartPoint) => yPrecipScale(d.precipMm))
      .attr('width', barWidth)
      .attr('height', (d: ClimateChartPoint) => Math.max(0, innerHeight - yPrecipScale(d.precipMm)))
      .attr('rx', 4)
      .attr('fill', 'url(#d3-precip-bar-gradient)')
      .attr('opacity', 0.85);

    // 5. High-Low Temperature Range Envelope (D3 Area)
    const areaGenerator = d3
      .area<ClimateChartPoint>()
      .x((d: ClimateChartPoint) => xScale(d.key) || 0)
      .y0((d: ClimateChartPoint) => yScale(d.avgLow))
      .y1((d: ClimateChartPoint) => yScale(d.avgHigh))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append('path')
      .datum(dataPoints)
      .attr('d', areaGenerator)
      .attr('fill', 'url(#d3-temp-area-gradient)');

    // 6. Average Temperature Line (D3 Line)
    const lineGenerator = d3
      .line<ClimateChartPoint>()
      .x((d: ClimateChartPoint) => xScale(d.key) || 0)
      .y((d: ClimateChartPoint) => yScale(d.avgTemp))
      .curve(d3.curveCatmullRom.alpha(0.5));

    g.append('path')
      .datum(dataPoints)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 3)
      .attr('filter', 'url(#d3-glow)');

    // 7. Node Dots for each data point
    g.selectAll<SVGCircleElement, ClimateChartPoint>('.temp-node')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('class', 'temp-node')
      .attr('cx', (d: ClimateChartPoint) => xScale(d.key) || 0)
      .attr('cy', (d: ClimateChartPoint) => yScale(d.avgTemp))
      .attr('r', mode === 'seasonal' ? 5 : 3.5)
      .attr('fill', '#0b1021')
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 2);

    // 8. X Axis Labels
    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight + 16})`);

    xAxisGroup
      .selectAll<SVGTextElement, ClimateChartPoint>('.x-label')
      .data(dataPoints)
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .attr('x', (d: ClimateChartPoint) => xScale(d.key) || 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255, 255, 255, 0.55)')
      .attr('font-size', mode === 'seasonal' ? '11px' : '10px')
      .attr('font-weight', '700')
      .text((d: ClimateChartPoint) => d.label);

    // 9. Left Y Axis (Temperature values)
    const yAxisGroup = g.append('g').attr('transform', 'translate(-8, 0)');
    yAxisGroup
      .selectAll<SVGTextElement, number>('.y-label')
      .data(yTicks)
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', 0)
      .attr('y', (d: number) => yScale(d) + 3)
      .attr('text-anchor', 'end')
      .attr('fill', 'rgba(255, 255, 255, 0.4)')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .text((d: number) => `${Math.round(d)}°`);

    // 10. Interactive Transparent Overlay for mouse & touch tracking
    const bisectKey = (mouseX: number) => {
      let closest = dataPoints[0];
      let minDiff = Infinity;
      dataPoints.forEach((d) => {
        const xPos = xScale(d.key) || 0;
        const diff = Math.abs(xPos - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          closest = d;
        }
      });
      return closest;
    };

    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const handlePointer = (event: any) => {
      const [mx] = d3.pointer(event);
      const closest = bisectKey(mx);
      if (!closest) return;

      const xPos = xScale(closest.key) || 0;
      const yPos = yScale(closest.avgTemp);

      // Render or update hover line and highlight dot
      g.selectAll('.hover-guide').remove();
      g.append('line')
        .attr('class', 'hover-guide')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', 'rgba(251, 191, 36, 0.5)')
        .attr('stroke-dasharray', '2 2')
        .attr('stroke-width', 1.5);

      g.append('circle')
        .attr('class', 'hover-guide')
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', 7)
        .attr('fill', '#fbbf24')
        .attr('fill-opacity', 0.4);

      g.append('circle')
        .attr('class', 'hover-guide')
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', 4)
        .attr('fill', '#fff')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2);

      // Tooltip payload
      if (mode === 'monthly') {
        const m = closest.raw as MonthlyClimateData;
        setActiveItem({
          title: m.fullName,
          subtitle: `Month ${dataPoints.indexOf(closest) + 1} of 12`,
          avgTempC: m.avgTempC,
          avgHighC: m.avgHighC,
          avgLowC: m.avgLowC,
          recordHighC: m.recordHighC,
          recordLowC: m.recordLowC,
          precipMm: m.precipMm,
          rainyDays: m.rainyDays,
          x: xPos + margin.left,
          y: yPos + margin.top,
        });
      } else {
        const s = closest.raw as SeasonalClimateData;
        setActiveItem({
          title: s.season,
          subtitle: s.months,
          avgTempC: s.avgTempC,
          avgHighC: s.avgHighC,
          avgLowC: s.avgLowC,
          precipMm: s.precipMm,
          trend: s.historicalTrend,
          note: s.climateNote,
          x: xPos + margin.left,
          y: yPos + margin.top,
        });
      }
    };

    overlay
      .on('pointermove', handlePointer)
      .on('pointerdown', handlePointer)
      .on('pointerleave', () => {
        g.selectAll('.hover-guide').remove();
        setActiveItem(null);
      });
  }, [dataPoints, innerWidth, innerHeight, mode, unit]);

  return (
    <div ref={containerRef} id="d3-climate-chart-container" className="relative w-full select-none">
      {/* Legend & Climatology indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 mb-2 text-[11px] text-white/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="font-semibold text-white/80">Mean Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-amber-400/25 border border-amber-400/40" />
            <span className="text-white/70">High–Low Envelope</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 rounded bg-sky-400/60" />
            <span className="text-sky-300">Precipitation</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-[10px] text-amber-300/90 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>D3 Climatological Normals</span>
        </div>
      </div>

      {/* SVG Canvas rendered with D3 */}
      <div className="w-full overflow-hidden">
        <svg
          ref={svgRef}
          id="d3-climate-svg"
          width={containerWidth}
          height={height}
          className="w-full overflow-visible"
        />
      </div>

      {/* Interactive Tooltip Card Overlay */}
      {activeItem && (
        <div
          id="d3-climate-tooltip"
          className="absolute z-20 pointer-events-none transition-all duration-75"
          style={{
            left: `${Math.min(
              Math.max(10, activeItem.x - 110),
              containerWidth - 230
            )}px`,
            top: `${Math.max(10, activeItem.y - 120)}px`,
          }}
        >
          <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-[0_12px_30px_rgba(0,0,0,0.7)] text-white text-xs min-w-[210px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <div>
                <span className="font-black text-sm text-amber-300">
                  {activeItem.title}
                </span>
                {activeItem.subtitle && (
                  <span className="block text-[10px] text-white/50">
                    {activeItem.subtitle}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">
                  {formatTemp(activeItem.avgTempC, unit)}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-white/40">
                  Average
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/5 rounded-lg p-1.5">
                <div className="text-[10px] text-white/50">High / Low</div>
                <div className="font-bold text-white/90">
                  {formatTemp(activeItem.avgHighC, unit)} /{' '}
                  {formatTemp(activeItem.avgLowC, unit)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-1.5">
                <div className="text-[10px] text-sky-300">Precipitation</div>
                <div className="font-bold text-white/90">
                  {formatPrecip(activeItem.precipMm, unit)}
                  {activeItem.rainyDays && (
                    <span className="text-[9px] text-white/40 font-normal">
                      {' '}
                      ({activeItem.rainyDays}d)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {activeItem.recordHighC !== undefined &&
              activeItem.recordLowC !== undefined && (
                <div className="mt-1.5 text-[10px] text-white/50 flex justify-between px-1">
                  <span>Record High: {formatTemp(activeItem.recordHighC, unit)}</span>
                  <span>Record Low: {formatTemp(activeItem.recordLowC, unit)}</span>
                </div>
              )}

            {activeItem.note && (
              <div className="mt-1.5 pt-1.5 border-t border-white/10 text-[10px] text-white/70 italic flex items-center gap-1">
                <Info className="w-3 h-3 text-sky-400 shrink-0" />
                <span>{activeItem.note}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected City Climate Summary Strip */}
      <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-white">
        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-[10px] uppercase font-bold text-white/40">
            Annual Mean
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-400 mt-0.5">
            {formatTemp(climateProfile.annualMeanTempC, unit)}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-[10px] uppercase font-bold text-white/40">
            Annual Rain
          </div>
          <div className="text-xs sm:text-sm font-black text-sky-400 mt-0.5">
            {formatPrecip(climateProfile.annualPrecipMm, unit)}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-[10px] uppercase font-bold text-white/40">
            Warmest / Coldest
          </div>
          <div className="text-xs sm:text-sm font-black text-white/90 truncate mt-0.5">
            {climateProfile.warmestMonth.slice(0, 3)} / {climateProfile.coldestMonth.slice(0, 3)}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-2">
          <div className="text-[10px] uppercase font-bold text-white/40">
            Climate Zone
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-white/80 truncate mt-0.5" title={climateProfile.zone}>
            {climateProfile.zone}
          </div>
        </div>
      </div>
    </div>
  );
};
