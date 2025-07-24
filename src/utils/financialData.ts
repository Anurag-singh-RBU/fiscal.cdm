import { FinancialData, CalendarData, VolatilityLevel, PerformanceType } from '@/types/financial';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from 'date-fns';

// Mock data generator for demonstration
export function generateMockData(startDate: Date, endDate: Date, symbol: string = 'BTC'): CalendarData {
  const data: CalendarData = {};
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  days.forEach((date, index) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const basePrice = 45000 + Math.sin(index * 0.1) * 5000;
    const volatility = Math.random() * 100; // 0-100%
    const performance = (Math.random() - 0.5) * 20; // -10% to +10%
    
    data[dateStr] = {
      date: dateStr,
      symbol,
      open: basePrice + (Math.random() - 0.5) * 2000,
      high: basePrice + Math.random() * 3000,
      low: basePrice - Math.random() * 2000,
      close: basePrice + (Math.random() - 0.5) * 2000,
      volume: Math.random() * 1000000000, // Random volume
      volatility,
      liquidity: Math.random() * 100000000,
      performance,
      marketCap: Math.random() * 1000000000000
    };
  });
  
  return data;
}

export function getVolatilityLevel(volatility: number): VolatilityLevel {
  if (volatility < 20) return 'low';
  if (volatility < 40) return 'medium';
  if (volatility < 70) return 'high';
  return 'extreme';
}

export function getPerformanceType(performance: number): PerformanceType {
  if (performance > 2) return 'bull';
  if (performance < -2) return 'bear';
  return 'neutral';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}

export function getVolatilityColor(level: VolatilityLevel): string {
  switch (level) {
    case 'low': return 'hsl(var(--volatility-low))';
    case 'medium': return 'hsl(var(--volatility-medium))';
    case 'high': return 'hsl(var(--volatility-high))';
    case 'extreme': return 'hsl(var(--volatility-extreme))';
  }
}

// Generate data for multiple months for calendar
export function generateCalendarData(currentDate: Date, monthsAround: number = 2): CalendarData {
  const startDate = startOfMonth(subMonths(currentDate, monthsAround));
  const endDate = endOfMonth(addMonths(currentDate, monthsAround));
  
  return generateMockData(startDate, endDate);
}