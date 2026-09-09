import { InputHTMLAttributes } from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <ShadcnInput
        {...props}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500/50",
          className
        )}
      />
      {error && <span className="text-xs font-medium text-red-400">{error}</span>}
    </div>
  );
}
