import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--cor-texto-principal)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full input ${error ? 'border-[var(--cor-erro)]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm" style={{ color: 'var(--cor-erro)' }}>{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--cor-texto-secundario)' }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
