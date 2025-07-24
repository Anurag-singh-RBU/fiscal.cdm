export interface FinancialData {
  date: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility: number;
  liquidity: number;
  performance: number;
  marketCap?: number;
}

export interface CalendarData {
  [date: string]: FinancialData;
}

export interface TimeframeData {
  daily: CalendarData;
  weekly: CalendarData;
  monthly: CalendarData;
}

export type VolatilityLevel = 'low' | 'medium' | 'high' | 'extreme';
export type PerformanceType = 'bull' | 'bear' | 'neutral';
export type TimeframeType = 'day' | 'week' | 'month';

export interface CalendarCellData {
  date: Date;
  data?: FinancialData;
  volatilityLevel: VolatilityLevel;
  performanceType: PerformanceType;
  isToday: boolean;
  isSelected: boolean;
  isInCurrentMonth: boolean;
}

export interface SelectedDateRange {
  start: Date | null;
  end: Date | null;
}