import { Card } from "$/components/ui/card";
import { cn } from "$/lib/utils";
import React from "react";

interface TAnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: TAnimatedCardProps) {
  return (
    <Card
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/30",
        "group",
        className
      )}
    >
      {/* Animated line on the top edge */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-2000 ease-out"></div>
      </div>

      {/* Animated line on the bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent transform translate-x-full group-hover:-translate-x-[200%] transition-transform duration-2000 ease-out delay-100"></div>
      </div>

      {/* Animated line on the left edge */}
      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent transform -translate-y-full group-hover:translate-y-[200%] transition-transform duration-2000 ease-out delay-50"></div>
      </div>

      {/* Animated line on the right edge */}
      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent transform translate-y-full group-hover:-translate-y-[200%] transition-transform duration-2000 ease-out delay-150"></div>
      </div>
      {children}
    </Card>
  );
}
