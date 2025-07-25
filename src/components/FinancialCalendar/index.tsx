import React, { useState, useEffect, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const calendarRef = useRef<HTMLDivElement>(null); // Reference for PDF export

  useEffect(() => {
    const data = generateCalendarData(currentDate, 3);
    setCalendarData(data);
  }, [currentDate, symbol]);

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

  const selectedFinancialData: FinancialData | null = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return calendarData[dateStr] || null;
  }, [selectedDate, calendarData]);

  const handleDateSelect = (date: Date) => setSelectedDate(date);
  const handleDateHover = (date: Date, data?: unknown) => setHoveredDate(data ? date : null);
  const handleDateChange = (date: Date) => setCurrentDate(date);
  const handleTimeframeChange = (newTimeframe: TimeframeType) => setTimeframe(newTimeframe);
  const handleSymbolChange = (newSymbol: string) => setSymbol(newSymbol);

  // 📤 Export to PDF
  const handleExportPDF = async () => {
    if (!calendarRef.current) return;

    const canvas = await html2canvas(calendarRef.current);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;

    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth / aspectRatio;

    // Fit to height if too tall
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight * aspectRatio;
    }

    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(`Fiscal-${symbol}.pdf`);
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

      {/* Export Button */}
      <div className="container px-2 mt-8 sm:px-4 mb-4 flex justify-center">
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Export PDF
        </button>
      </div>

      {/* Main Content for PDF */}
      <div className="container mx-auto p-2 sm:p-4" ref={calendarRef}>
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Calendar Section */}
          <div className="w-full lg:flex-1">
            <CalendarGrid
              currentDate={currentDate}
              calendarData={calendarCellData}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onDateHover={handleDateHover}
            />
          </div>

          {/* Data Panel */}
          <div className="w-full lg:w-[320px] xl:w-[400px]">
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
