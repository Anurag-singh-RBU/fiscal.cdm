import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialData } from '@/types/financial';
import { formatCurrency, formatPercentage, formatVolume, getVolatilityLevel, getPerformanceType } from '@/utils/financialData';
import { TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DataPanelProps {
  selectedDate: Date | null;
  financialData: FinancialData | null;
  className?: string;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  selectedDate,
  financialData,
  className
}) => {
  if (!selectedDate) {
    return (
      <Card className={cn("h-fit", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Market Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a date to view detailed market data
          </p>
        </CardContent>
      </Card>
    );
  }

  const performanceType = financialData ? getPerformanceType(financialData.performance) : 'neutral';
  const volatilityLevel = financialData ? getVolatilityLevel(financialData.volatility) : 'low';

  const getPerformanceIcon = () => {
    switch (performanceType) {
      case 'bull':
        return <TrendingUp className="w-4 h-4 text-bull" />;
      case 'bear':
        return <TrendingDown className="w-4 h-4 text-bear" />;
      default:
        return <BarChart3 className="w-4 h-4 text-neutral" />;
    }
  };

  const getVolatilityBadgeVariant = () => {
    switch (volatilityLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'extreme': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          {format(selectedDate, 'MMM dd, yyyy')}
        </CardTitle>
        {financialData && (
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
            <Badge variant={getVolatilityBadgeVariant()} className="text-xs">
              {volatilityLevel.toUpperCase()} VOLATILITY
            </Badge>
            <div className="flex items-center gap-1">
              {getPerformanceIcon()}
              <span className={cn(
                "text-sm font-medium",
                performanceType === 'bull' ? "text-bull" : 
                performanceType === 'bear' ? "text-bear" : "text-neutral"
              )}>
                {financialData ? formatPercentage(financialData.performance) : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 pt-0">
        {!financialData ? (
          <p className="text-muted-foreground text-center py-4 text-sm">
            No data available for this date
          </p>
        ) : (
          <>
            {/* Price Information */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <DollarSign className="w-4 h-4" />
                Price Data
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Open</p>
                  <p className="font-medium text-sm sm:text-base">{formatCurrency(financialData.open)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Close</p>
                  <p className="font-medium text-sm sm:text-base">{formatCurrency(financialData.close)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="font-medium text-bull text-sm sm:text-base">{formatCurrency(financialData.high)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="font-medium text-bear text-sm sm:text-base">{formatCurrency(financialData.low)}</p>
                </div>
              </div>
            </div>

            {/* Volume & Liquidity */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <Volume2 className="w-4 h-4" />
                Market Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Trading Volume</p>
                  <p className="font-medium text-sm sm:text-base">{formatVolume(financialData.volume)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Liquidity</p>
                  <p className="font-medium text-sm sm:text-base">{formatVolume(financialData.liquidity)}</p>
                </div>
                {financialData.marketCap && (
                  <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="font-medium text-sm sm:text-base">{formatVolume(financialData.marketCap)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Volatility Analysis */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
                <Activity className="w-4 h-4" />
                Volatility Analysis
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Volatility</span>
                  <span className="font-medium text-sm sm:text-base">{financialData.volatility.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all",
                      volatilityLevel === 'low' && "bg-volatility-low",
                      volatilityLevel === 'medium' && "bg-volatility-medium", 
                      volatilityLevel === 'high' && "bg-volatility-high",
                      volatilityLevel === 'extreme' && "bg-volatility-extreme"
                    )}
                    style={{ width: `${Math.min(financialData.volatility, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Technical Indicators</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">RSI</p>
                  <p className="font-medium text-sm">{(Math.random() * 100).toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">MACD</p>
                  <p className="font-medium text-sm">{((Math.random() - 0.5) * 1000).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};