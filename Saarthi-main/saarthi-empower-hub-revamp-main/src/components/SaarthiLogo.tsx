
import React from 'react';

interface SaarthiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SaarthiLogo = ({ className = '', size = 'md' }: SaarthiLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/images/d1d9c4de-5c9b-4c52-92aa-8824226b4730.png" 
        alt="Saarthi Logo" 
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  );
};

export default SaarthiLogo;
