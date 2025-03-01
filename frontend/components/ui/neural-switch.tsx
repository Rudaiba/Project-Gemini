'use client';

import { useState } from 'react';

interface NeuralSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function NeuralSwitch({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
}: NeuralSwitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <label
      className={`
        relative flex items-start gap-4 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Switch Track */}
      <div className="relative flex-shrink-0 w-11 h-6 mt-1">
        <div
          className={`
            absolute inset-0 rounded-full transition-colors duration-200
            ${checked ? 'bg-neural-gradient' : 'bg-border'}
            ${isHovered && !disabled ? 'shadow-lg' : ''}
          `}
        >
          {/* Glow Effect */}
          <div
            className={`
              absolute inset-0 rounded-full transition-opacity duration-200
              bg-neural-gradient opacity-0
              ${isHovered && !disabled ? 'opacity-30 blur-md' : ''}
            `}
          />
        </div>

        {/* Switch Thumb */}
        <div
          className={`
            absolute left-0.5 top-0.5 w-5 h-5
            bg-background rounded-full shadow-sm
            transform transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
          <div
            className={`
              absolute inset-1 rounded-full
              transition-opacity duration-200
              ${checked ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <svg
              className="w-3 h-3 text-accent-purple"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange?.(e.target.checked)}
          disabled={disabled}
        />
      </div>

      {/* Label and Description */}
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
        )}
        {description && (
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </label>
  );
} 