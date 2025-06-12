import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  className,
  glowColor = 'blue',
  intensity = 'medium'
}) => {
  const getGlowIntensity = () => {
    switch (intensity) {
      case 'low':
        return '0 0 20px';
      case 'high':
        return '0 0 60px';
      default:
        return '0 0 40px';
    }
  };

  const getGlowColorValue = () => {
    switch (glowColor) {
      case 'purple':
        return 'rgba(147, 51, 234, 0.3)';
      case 'emerald':
        return 'rgba(16, 185, 129, 0.3)';
      case 'orange':
        return 'rgba(249, 115, 22, 0.3)';
      case 'pink':
        return 'rgba(236, 72, 153, 0.3)';
      default:
        return 'rgba(59, 130, 246, 0.3)';
    }
  };

  return (
    <motion.div
      whileHover={{
        boxShadow: `${getGlowIntensity()} ${getGlowColorValue()}`,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className={cn("relative overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        {children}
      </Card>
    </motion.div>
  );
};

export default GlowingCard;