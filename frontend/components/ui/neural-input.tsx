'use client';

interface NeuralInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function NeuralInput({ label, error, className = '', ...props }: NeuralInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-2 rounded-lg
            bg-background border border-border
            focus:outline-none focus:ring-2 focus:ring-accent-purple/20
            placeholder:text-muted-foreground
            transition-all duration-200
            ${error ? 'border-red-500' : 'hover:border-accent-blue/50'}
            ${className}
          `}
          {...props}
        />
        
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-purple/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-blue/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-mint/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-purple/30 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

interface NeuralTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function NeuralTextarea({ label, error, className = '', ...props }: NeuralTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-2 rounded-lg
            bg-background border border-border
            focus:outline-none focus:ring-2 focus:ring-accent-purple/20
            placeholder:text-muted-foreground
            transition-all duration-200
            ${error ? 'border-red-500' : 'hover:border-accent-blue/50'}
            ${className}
          `}
          {...props}
        />
        
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-purple/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-blue/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-mint/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-purple/30 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

interface NeuralSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function NeuralSelect({ label, error, options, className = '', ...props }: NeuralSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2 rounded-lg appearance-none
            bg-background border border-border
            focus:outline-none focus:ring-2 focus:ring-accent-purple/20
            placeholder:text-muted-foreground
            transition-all duration-200
            ${error ? 'border-red-500' : 'hover:border-accent-blue/50'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom Select Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-purple/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-blue/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-mint/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-purple/30 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
} 