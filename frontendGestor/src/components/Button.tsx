import { ButtonHTMLAttributes } from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'default' | 'destructive' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'icon';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  let mappedVariant: ShadcnButtonProps['variant'] = 'default';
  if (variant === 'primary') mappedVariant = 'gradient';
  else if (variant === 'danger') mappedVariant = 'destructive';
  else if (variant === 'secondary') mappedVariant = 'secondary';
  else mappedVariant = variant as ShadcnButtonProps['variant'];

  let mappedSize: ShadcnButtonProps['size'] = 'default';
  if (size === 'md') mappedSize = 'default';
  else mappedSize = size as ShadcnButtonProps['size'];

  return (
    <ShadcnButton
      variant={mappedVariant}
      size={mappedSize}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando...</span>
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
