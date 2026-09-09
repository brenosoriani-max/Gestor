import styles from './Button.module.css';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
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
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}
