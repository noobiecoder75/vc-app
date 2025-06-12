import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MorphingButtonProps {
  children: React.ReactNode;
  onClick?: () => Promise<void> | void;
  successText?: string;
  errorText?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

const MorphingButton: React.FC<MorphingButtonProps> = ({
  children,
  onClick,
  successText = 'Success!',
  errorText = 'Error',
  className,
  variant = 'default',
  size = 'default'
}) => {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = async () => {
    if (state !== 'idle') return;

    setState('loading');
    
    try {
      if (onClick) {
        await onClick();
      }
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </motion.div>
        );
      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{successText}</span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>{errorText}</span>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {children}
          </motion.div>
        );
    }
  };

  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return variant;
    }
  };

  return (
    <Button
      variant={getButtonVariant()}
      size={size}
      onClick={handleClick}
      disabled={state !== 'idle'}
      className={cn(
        "transition-all duration-300",
        state === 'success' && "bg-emerald-600 hover:bg-emerald-700",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {getButtonContent()}
      </AnimatePresence>
    </Button>
  );
};

export default MorphingButton;