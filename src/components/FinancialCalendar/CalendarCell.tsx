import React from 'react';
import { CalendarCellData } from '@/types/financial';
import { formatCurrency, formatPercentage, getVolatilityColor } from '@/utils/financialData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarCellProps {
  cellData: CalendarCellData;
  onClick: (date: Date) => void;
  onHover: (date: Date, data?: any) => void;
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
        "relative h-24 p-2 border border-border/50 cursor-pointer transition-all duration-200",
        "hover:border-primary/50 hover:shadow-glow",
        isToday && "ring-2 ring-primary",
        isSelected && "bg-primary/20 border-primary",
        !isInCurrentMonth && "opacity-40",
        !data && "bg-muted/30",
        "group",
        className
      )}
      style={getCellBackground()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Date number */}
      <div className={cn(
        "text-sm font-medium",
        isToday ? "text-primary" : "text-foreground/80"
      )}>
        {date.getDate()}
      </div>

      {/* Performance indicator */}
      {data && (
        <div className="absolute top-2 right-2">
          {getPerformanceIcon()}
        </div>
      )}

      {/* Price display */}
      {data && (
        <div className="mt-1">
          <div className="text-xs text-foreground/60">
            {formatCurrency(data.close)}
          </div>
          <div className={cn(
            "text-xs font-medium",
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
          className="absolute top-0 left-0 right-0 h-1 rounded-t"
          style={{ backgroundColor: getVolatilityColor(volatilityLevel) }}
        />
      )}

      {/* Liquidity indicator (bottom bar) */}
      {getLiquidityIndicator()}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};