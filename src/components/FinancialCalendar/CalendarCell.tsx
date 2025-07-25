import React from 'react';
import { CalendarCellData } from '@/types/financial';
import { formatCurrency, formatPercentage, getVolatilityColor } from '@/utils/financialData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarCellProps {
  cellData: CalendarCellData;
  onClick: (date: Date) => void;
  onHover: (date: Date, data?: unknown) => void;
  className?: string;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  cellData,
  onClick,
  onHover,
  className
}) => {
  const { date, data, volatilityLevel, performanceType, isToday, isSelected, isInCurrentMonth } = cellData;
  
  const handleClick = () => onClick(date);
  const handleMouseEnter = () => onHover(date, data);
  const handleMouseLeave = () => onHover(date);

  const getPerformanceIcon = () => {
    switch (performanceType) {
      case 'bull':
        return <TrendingUp className="w-3 h-3 text-bull" />;
      case 'bear':
        return <TrendingDown className="w-3 h-3 text-bear" />;
      default:
        return <Minus className="w-3 h-3 text-neutral" />;
    }
  };

  const getCellBackground = () => {
    if (!data) return {};
    
    const alpha = Math.min(data.volatility / 100, 1) * 0.3 + 0.1;
    return {
      backgroundColor: `${getVolatilityColor(volatilityLevel)}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
    };
  };

  const getLiquidityIndicator = () => {
    if (!data) return null;
    
    const intensity = Math.min(data.liquidity / 100000000, 1);
    return (
      <div 
        className="absolute bottom-0 left-0 right-0 bg-primary/40"
        style={{ height: `${intensity * 4}px` }}
      />
    );
  };

  return (
    <div
      className={cn(
        "relative h-16 sm:h-20 md:h-24 p-1 sm:p-2 border border-border/50 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:shadow-glow active:scale-95",
        isToday && "ring-2 ring-primary",
        isSelected && "bg-primary/20 border-primary",
        !isInCurrentMonth && "opacity-40",
        !data && "bg-muted/30",
        "group touch-manipulation",
        className
      )}
      style={getCellBackground()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Date number */}
      <div className={cn(
        "text-xs sm:text-sm font-medium leading-none",
        isToday ? "text-primary" : "text-foreground/80"
      )}>
        {date.getDate()}
      </div>

      {/* Performance indicator */}
      {data && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3">
            {getPerformanceIcon()}
          </div>
        </div>
      )}

      {/* Price display - Mobile optimized */}
      {data && (
        <div className="mt-1 space-y-0.5">
          <div className="text-[10px] sm:text-xs text-foreground/60 leading-none">
            {formatCurrency(data.close)}
          </div>
          <div className={cn(
            "text-[10px] sm:text-xs font-medium leading-none",
            performanceType === 'bull' ? "text-bull" : 
            performanceType === 'bear' ? "text-bear" : "text-neutral"
          )}>
            {formatPercentage(data.performance)}
          </div>
        </div>
      )}

      {/* Volatility indicator (top border) */}
      {data && (
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 rounded-t"
          style={{ backgroundColor: getVolatilityColor(volatilityLevel) }}
        />
      )}

      {/* Liquidity indicator (bottom bar) */}
      {getLiquidityIndicator()}

      {/* Touch feedback overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 group-active:opacity-20 transition-opacity pointer-events-none" />
    </div>
  );
};