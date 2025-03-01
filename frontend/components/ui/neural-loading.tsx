'use client';

interface NeuralLoadingProps {
  size?: 'sm' | 'md' | 'lg';
}

export function NeuralLoading({ size = 'md' }: NeuralLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Ring */}
      <div
        className={`
          absolute ${sizeClasses[size]}
          border-2 border-t-accent-purple border-r-accent-blue
          border-b-accent-mint border-l-transparent
          rounded-full animate-spin
        `}
      />
      
      {/* Inner Ring */}
      <div
        className={`
          absolute ${sizeClasses[size]}
          border border-t-transparent border-r-accent-purple/30
          border-b-accent-blue/30 border-l-accent-mint/30
          rounded-full animate-spin
        `}
        style={{ animationDirection: 'reverse', animationDuration: '1s' }}
      />
      
      {/* Center Dot */}
      <div
        className={`
          ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}
          bg-gradient-to-br from-accent-purple via-accent-blue to-accent-mint
          rounded-full animate-pulse
        `}
      />
    </div>
  );
}

interface NeuralLoadingOverlayProps {
  children?: React.ReactNode;
}

export function NeuralLoadingOverlay({ children }: NeuralLoadingOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <NeuralLoading size="lg" />
      {children && (
        <div className="mt-4 text-sm text-muted-foreground animate-pulse">
          {children}
        </div>
      )}
    </div>
  );
} 