import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  id,
  onClick 
}) => (
  <div 
    id={id}
    onClick={onClick}
    className={`backdrop-blur-2xl bg-white/[0.07] border border-white/15 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_rgba(2,12,38,0.35)] transition-all ${className}`}
  >
    {children}
  </div>
);
