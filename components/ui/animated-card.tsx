import { Card } from '$/components/ui/card';
import { cn } from '$/lib/utils';
import type React from 'react';

interface TAnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: TAnimatedCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-lg transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/30',
        'group',
        className
      )}
    >
      {/* Animated line on the top edge */}
      <div className="absolute top-0 left-0 h-0.5 w-full overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="-translate-x-full h-full w-1/2 transform bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-2000 ease-out group-hover:translate-x-[200%]" />
      </div>

      {/* Animated line on the bottom edge */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="group-hover:-translate-x-[200%] h-full w-1/2 translate-x-full transform bg-gradient-to-r from-transparent via-primary to-transparent transition-transform delay-100 duration-2000 ease-out" />
      </div>

      {/* Animated line on the left edge */}
      <div className="absolute top-0 left-0 h-full w-0.5 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="-translate-y-full h-1/2 w-full transform bg-gradient-to-b from-transparent via-primary to-transparent transition-transform delay-50 duration-2000 ease-out group-hover:translate-y-[200%]" />
      </div>

      {/* Animated line on the right edge */}
      <div className="absolute top-0 right-0 h-full w-0.5 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="group-hover:-translate-y-[200%] h-1/2 w-full translate-y-full transform bg-gradient-to-b from-transparent via-primary to-transparent transition-transform delay-150 duration-2000 ease-out" />
      </div>
      {children}
    </Card>
  );
}
