import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { TimeframeType } from '@/types/financial';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  timeframe: TimeframeType;
  onDateChange: (date: Date) => void;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  timeframe,
  onDateChange,
  onTimeframeChange,
  symbol,
  onSymbolChange
}) => {
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (timeframe === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (timeframe === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (timeframe === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatDisplayDate = () => {
    if (timeframe === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (timeframe === 'week') {
      return format(currentDate, 'MMM dd, yyyy');
    } else {
      return format(currentDate, 'EEEE, MMM dd, yyyy');
    }
  };

  const timeframes: { value: TimeframeType; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ];

  const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];

  return (
    <div className="bg-card border-b border-border p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Top row - Title and Symbol */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Fiscal</h1>
          </div>
          
          {/* Symbol selector */}
          <select
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="bg-secondary border border-border rounded px-2 py-1 text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {symbols.map(sym => (
              <option key={sym} value={sym}>{sym}/USD</option>
            ))}
          </select>
        </div>

        {/* Bottom row - Date navigation and timeframe */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Date navigation */}
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="p-2 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="min-w-[160px] sm:min-w-[200px] text-center">
              <h2 className="text-sm sm:text-lg font-semibold text-foreground">
                {formatDisplayDate()}
              </h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="p-2 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="ml-2 h-8 px-2 sm:px-3"
            >
              <Calendar className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Today</span>
            </Button>
          </div>

          {/* Timeframe selector */}
          <div className="flex bg-secondary rounded-lg p-1 order-1 sm:order-2">
            {timeframes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onTimeframeChange(value)}
                className={cn(
                  "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded transition-all",
                  timeframe === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};