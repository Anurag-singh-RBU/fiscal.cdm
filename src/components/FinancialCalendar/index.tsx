import React, { useState, useEffect, useMemo } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DataPanel } from './DataPanel';
import { CalendarData, CalendarCellData, TimeframeType, FinancialData } from '@/types/financial';
import { generateCalendarData, getVolatilityLevel, getPerformanceType } from '@/utils/financialData';
import { format, isSameDay } from 'date-fns';

export const FinancialCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [timeframe, setTimeframe] = useState<TimeframeType>('month');
  const [symbol, setSymbol] = useState('BTC');
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  // Generate mock data when component mounts or symbol changes
  useEffect(() => {
    const data = generateCalendarData(currentDate, 3);
    setCalendarData(data);
  }, [currentDate, symbol]);

  // Convert calendar data to cell data format
  const calendarCellData: CalendarCellData[] = useMemo(() => {
    return Object.entries(calendarData).map(([dateStr, data]) => {
      const date = new Date(dateStr);
      return {
        date,
        data,
        volatilityLevel: getVolatilityLevel(data.volatility),
        performanceType: getPerformanceType(data.performance),
        isToday: isSameDay(date, new Date()),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        isInCurrentMonth: date.getMonth() === currentDate.getMonth()
      };
    });
  }, [calendarData, selectedDate, currentDate]);

  // Get financial data for selected date
  const selectedFinancialData: FinancialData | null = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return calendarData[dateStr] || null;
  }, [selectedDate, calendarData]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDateHover = (date: Date, data?: any) => {
    setHoveredDate(data ? date : null);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleTimeframeChange = (newTimeframe: TimeframeType) => {
    setTimeframe(newTimeframe);
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader
        currentDate={currentDate}
        timeframe={timeframe}
        onDateChange={handleDateChange}
        onTimeframeChange={handleTimeframeChange}
        symbol={symbol}
        onSymbolChange={handleSymbolChange}
      />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <CalendarGrid
              currentDate={currentDate}
              calendarData={calendarCellData}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onDateHover={handleDateHover}
            />
          </div>
          
          {/* Data Panel */}
          <div className="xl:col-span-1">
            <DataPanel
              selectedDate={selectedDate}
              financialData={selectedFinancialData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};