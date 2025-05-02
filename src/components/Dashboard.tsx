
import { useState, useCallback } from 'react';
import FilterPanel from './FilterPanel';
import LineChartComponent from './charts/LineChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import PieChartComponent from './charts/PieChartComponent';
import ChartSkeleton from './ChartSkeleton';
import WeatherWidget from './WeatherWidget';
import CryptoWidget from './CryptoWidget';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  activeItem: string;
}

const Dashboard = ({ activeItem }: DashboardProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [category, setCategory] = useState(() => {
    // Set default category based on active chart type
    switch (activeItem) {
      case 'lineChart':
        return 'price';
      case 'barChart':
        return 'revenue';
      case 'pieChart':
        return 'allocation';
      default:
        return 'price';
    }
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Fetching the latest information from our servers.",
      duration: 2000
    });
  }, []);

  // Render the appropriate chart based on the active item
  const renderChart = () => {
    switch (activeItem) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <p className="text-sm font-medium opacity-80">Market Index</p>
                  <h3 className="text-3xl font-bold mt-1">32,587</h3>
                  <div className="flex items-center mt-2 text-emerald-300">
                    <span className="text-sm font-medium">↑ 1.87%</span>
                    <span className="text-xs ml-1 opacity-80">Today</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <p className="text-sm font-medium opacity-80">Trading Volume</p>
                  <h3 className="text-3xl font-bold mt-1">$1.34B</h3>
                  <div className="flex items-center mt-2 text-emerald-200">
                    <span className="text-sm font-medium">↑ 2.54%</span>
                    <span className="text-xs ml-1 opacity-80">Since yesterday</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <p className="text-sm font-medium opacity-80">Active Investors</p>
                  <h3 className="text-3xl font-bold mt-1">824,593</h3>
                  <div className="flex items-center mt-2 text-red-300">
                    <span className="text-sm font-medium">↓ 0.32%</span>
                    <span className="text-xs ml-1 opacity-80">Since last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Weather and Crypto Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <WeatherWidget key={`weather-${refreshKey}`} />
              <CryptoWidget key={`crypto-${refreshKey}`} />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LineChartComponent key={`line-${refreshKey}`} timeRange={timeRange} category="price" />
              <BarChartComponent key={`bar-${refreshKey}`} timeRange={timeRange} category="revenue" />
              <PieChartComponent key={`pie-${refreshKey}`} timeRange={timeRange} category="allocation" />
            </div>
          </div>
        );
      case 'lineChart':
        return (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Stock Price Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Analyze stock price movements and trading volumes to identify market trends.
              Select different time ranges and data categories to customize your view.
            </p>
            <LineChartComponent key={`line-${refreshKey}`} timeRange={timeRange} category={category} />
          </div>
        );
      case 'barChart':
        return (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Financial Performance</h2>
            <p className="text-muted-foreground mb-6">
              View detailed financial metrics including revenue, expenses, and profit margins.
              Compare performance across different quarters and fiscal periods.
            </p>
            <BarChartComponent key={`bar-${refreshKey}`} timeRange={timeRange} category={category} />
          </div>
        );
      case 'pieChart':
        return (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Market Distribution</h2>
            <p className="text-muted-foreground mb-6">
              Analyze market segments, geographic distribution, and customer demographics.
              Understand how investments and resources are allocated across different sectors.
            </p>
            <PieChartComponent key={`pie-${refreshKey}`} timeRange={timeRange} category={category} />
          </div>
        );
      case 'weather':
        return (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Weather Forecast</h2>
            <p className="text-muted-foreground mb-6">
              Get real-time weather information for major global cities.
              Track temperature, humidity, and wind conditions to better plan your day.
            </p>
            <WeatherWidget key={`weather-${refreshKey}`} />
          </div>
        );
      case 'crypto':
        return (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-bold mb-6">Cryptocurrency Market</h2>
            <p className="text-muted-foreground mb-6">
              Monitor real-time cryptocurrency prices, market caps, and trading volumes.
              Track the performance of top cryptocurrencies in the global market.
            </p>
            <CryptoWidget key={`crypto-${refreshKey}`} />
          </div>
        );
      default:
        return <ChartSkeleton />;
    }
  };

  return (
    <div className="fade-in">
      {activeItem !== 'overview' && activeItem !== 'weather' && activeItem !== 'crypto' && (
        <FilterPanel 
          onTimeRangeChange={handleTimeRangeChange}
          onCategoryChange={handleCategoryChange}
          chartType={activeItem}
          onRefresh={handleRefresh}
        />
      )}
      <div>{renderChart()}</div>
    </div>
  );
};

export default Dashboard;
