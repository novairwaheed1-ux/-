import React from 'react';
import { sultanChefLogoImg } from '../data/dishes';

interface RestaurantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-md shadow-amber-900/20 group`}>
        {/* Outer gentle rotating ring glow */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xs group-hover:bg-amber-400/40 transition-colors" />
        
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-2 border-[#231811]">
          <img
            src={sultanChefLogoImg}
            alt="شعار مطعم السلطان محمود الرسمي"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {showText && (
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-800 tracking-wider">مطعم</span>
            <span className="text-lg sm:text-xl font-black text-[#231811]">السلطان محمود</span>
          </div>
          <p className="text-[10px] text-[#695444] font-medium">
            الأسماك والبحريات & المشويات والشاورما السورية
          </p>
        </div>
      )}
    </div>
  );
};
