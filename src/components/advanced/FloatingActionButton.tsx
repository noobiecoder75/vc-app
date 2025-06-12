import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  className,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getActionPosition = (index: number) => {
    const spacing = 60;
    switch (position) {
      case 'bottom-left':
      case 'bottom-right':
        return { y: -(spacing * (index + 1)) };
      case 'top-left':
      case 'top-right':
        return { y: spacing * (index + 1) };
      default:
        return { y: -(spacing * (index + 1)) };
    }
  };

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, ...getActionPosition(index) }}
              animate={{ opacity: 1, scale: 1, ...getActionPosition(index) }}
              exit={{ opacity: 0, scale: 0, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="absolute bottom-0 right-0"
            >
              <Button
                size="icon"
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                  action.color || "bg-blue-600 hover:bg-blue-700"
                )}
                title={action.label}
              >
                <Icon className="w-5 h-5" />
              </Button>
              
              {/* Label */}
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {action.label}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingActionButton;