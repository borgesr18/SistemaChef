import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '', 
  footer 
}) => {
  return (
    <div className={`card overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--cor-borda)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'var(--cor-texto-principal)' }}>{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t" style={{ borderColor: 'var(--cor-borda)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
