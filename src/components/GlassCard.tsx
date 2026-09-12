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
    className={`backdrop-blur-md bg-[#091b3b]/85 sm:bg-[#0c224a]/75 border border-white/[0.14] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors duration-200 ${className}`}
  >
    {children}
  </div>
);

