'use client';

import { useState } from 'react';

interface NeuralControlProps {
  isActive?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}

export function NeuralControl({ isActive, onClick, icon, label }: NeuralControlProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group flex items-center justify-center
        w-12 h-12 rounded-full neural-button
        ${isActive ? 'animate-pulse-glow' : ''}
      `}
      aria-label={label}
    >
      {/* Icon */}
      <div className="w-6 h-6 text-foreground">
        {icon}
      </div>

      {/* Tooltip */}
      <div
        className={`
          absolute -top-10 left-1/2 -translate-x-1/2
          px-3 py-1.5 rounded-lg text-sm
          bg-popover text-popover-foreground
          opacity-0 transform -translate-y-2
          transition-all duration-300
          ${isHovered ? 'opacity-100 translate-y-0' : ''}
          glass-panel
        `}
      >
        {label}
        {/* Tooltip Arrow */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2
                     w-2 h-2 bg-popover rotate-45
                     border-r border-b border-border/20"
        />
      </div>
    </button>
  );
}

interface NeuralControlsProps {
  children: React.ReactNode;
}

export function NeuralControls({ children }: NeuralControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                    flex items-center gap-6 p-4 rounded-full glass-panel
                    z-10">
      {children}
    </div>
  );
}

interface NeuralVideoContainerProps {
  children: React.ReactNode;
}

export function NeuralVideoContainer({ children }: NeuralVideoContainerProps) {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden floating-card">
      {children}
      {/* Decorative Corner Elements */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-accent-purple/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent-blue/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent-mint/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-accent-purple/30" />
    </div>
  );
}

interface NeuralSettingsPanelProps {
  children: React.ReactNode;
}

export function NeuralSettingsPanel({ children }: NeuralSettingsPanelProps) {
  return (
    <div className="space-y-6 p-6 floating-card">
      {children}
    </div>
  );
} 