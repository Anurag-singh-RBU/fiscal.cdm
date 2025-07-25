import React from 'react';
import { CalendarCell } from './CalendarCell';
import { CalendarCellData } from '@/types/financial';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, startOfMonth, endOfMonth } from 'date-fns';

interface CalendarGridProps {
  currentDate: Date;
  calendarData: CalendarCellData[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onDateHover: (date: Date, data?: unknown) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  calendarData,
  selectedDate,
  onDateSelect,
  onDateHover
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar grid (6 weeks)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Ensure we have 6 weeks (42 days)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  while (calendarDays.length < 42) {
    const lastDay = calendarDays[calendarDays.length - 1];
    const nextDay = new Date(lastDay);
    nextDay.setDate(nextDay.getDate() + 1);
    calendarDays.push(nextDay);
  }

  const findCellData = (date: Date): CalendarCellData | undefined => {
    return calendarData.find(cell => isSameDay(cell.date, date));
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {weekDays.map(day => (
          <div
            key={day}
            className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-foreground/60 border-r border-border last:border-r-0"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const cellData = findCellData(date);
          const defaultCellData: CalendarCellData = {
            date,
            data: cellData?.data,
            volatilityLevel: cellData?.volatilityLevel || 'low',
            performanceType: cellData?.performanceType || 'neutral',
            isToday: isSameDay(date, new Date()),
            isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
            isInCurrentMonth: isSameMonth(date, currentDate)
          };

          return (
            <CalendarCell
              key={index}
              cellData={defaultCellData}
              onClick={onDateSelect}
              onHover={onDateHover}
              className="border-r border-b border-border last:border-r-0"
            />
          );
        })}
      </div>
    </div>
  );
};