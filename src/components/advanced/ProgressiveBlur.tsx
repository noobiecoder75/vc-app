import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressiveBlurProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  children,
  className,
  intensity = 10,
  direction = 'bottom'
}) => {
  const getGradientDirection = () => {
    switch (direction) {
      case 'top':
        return 'to bottom';
      case 'left':
        return 'to right';
      case 'right':
        return 'to left';
      default:
        return 'to top';
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "absolute inset-0 pointer-events-none"
        )}
        style={{
          background: `linear-gradient(${getGradientDirection()}, transparent 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.8) 100%)`,
          backdropFilter: `blur(${intensity}px)`,
          WebkitBackdropFilter: `blur(${intensity}px)`
        }}
      />
    </div>
  );
};

export default ProgressiveBlur;