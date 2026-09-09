import styles from './Input.module.css';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input {...props} className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
