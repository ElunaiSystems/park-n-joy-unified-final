import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface JoyCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'idle' | 'bounce' | 'talking' | 'thinking' | 'excited' | 'loading';
  className?: string;
  interactive?: boolean;
  message?: string;
}

export default function JoyCharacter({ 
  size = 'md', 
  animation = 'idle',
  className,
  interactive = false,
  message
}: JoyCharacterProps) {
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-10',
    md: 'w-12 h-16', 
    lg: 'w-20 h-26',
    xl: 'w-32 h-40'
  };

  const animationClasses = {
    idle: '',
    bounce: '',
    talking: '',
    thinking: '',
    excited: '',
    loading: 'animate-spin'
  };

  useEffect(() => {
    setCurrentAnimation(animation);
  }, [animation]);

  const handleClick = () => {
    if (interactive) {
      setCurrentAnimation('excited');
      setTimeout(() => setCurrentAnimation('idle'), 1000);
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Official Joy Character Asset */}
      <div 
        className={cn(
          "relative",
          sizeClasses[size],
          animationClasses[currentAnimation]
        )}
        onClick={handleClick}
      >
        {/* Joy Official Asset */}
        <img 
          src="/lovable-uploads/afb4ae7d-9b46-4eba-bf73-4f81cccf54fc.png" 
          alt="Joy - Your Travel Assistant"
          className={cn(
            "w-full h-full object-contain transition-all duration-300",
            currentAnimation === 'excited' && "brightness-110",
            currentAnimation === 'talking' && "brightness-105",
            interactive && "drop-shadow-lg"
          )}
          draggable={false}
        />
        
        {/* Subtle Glow Effect for Animations */}
        {(currentAnimation === 'excited' || currentAnimation === 'talking') && (
          <div className={cn(
            "absolute inset-0 rounded-full blur-md opacity-20 transition-opacity pointer-events-none",
            "bg-emerald-400",
            currentAnimation === 'excited' && "opacity-40 animate-pulse"
          )} />
        )}
      </div>


    </div>
  );
}