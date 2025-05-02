
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Settings, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterPanelProps {
  onTimeRangeChange: (range: string) => void;
  onCategoryChange: (category: string) => void;
  chartType: string;
  onRefresh?: () => void;
}

const FilterPanel = ({ onTimeRangeChange, onCategoryChange, chartType, onRefresh }: FilterPanelProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [chartView, setChartView] = useState("line");
  
  const timeRanges = [
    { value: "1d", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "1m", label: "1 Month" },
    { value: "3m", label: "3 Months" },
    { value: "1y", label: "1 Year" },
  ];
  
  const categories = {
    lineChart: [
      { value: "price", label: "Stock Price" },
      { value: "volume", label: "Trading Volume" },
    ],
    barChart: [
      { value: "revenue", label: "Revenue" },
      { value: "expenses", label: "Expenses" },
      { value: "profit", label: "Profit" },
    ],
    pieChart: [
      { value: "allocation", label: "Sector Allocation" },
      { value: "distribution", label: "Geographic Distribution" },
      { value: "segments", label: "Customer Segments" },
    ],
  };

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    onTimeRangeChange(value);
  };

  const categoryOptions = chartType === 'lineChart' 
    ? categories.lineChart 
    : chartType === 'barChart' 
      ? categories.barChart 
      : categories.pieChart;

  const handleAutoRefreshChange = (checked: boolean) => {
    setAutoRefresh(checked);
    // You would implement the actual refresh interval logic here
  };

  return (
    <Card className="mb-6 p-4 border bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="md:flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Range</h3>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedTimeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange(range.value)}
                className="transition-all"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-[200px] md:flex-shrink-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Data Category</h3>
          <Select onValueChange={onCategoryChange} defaultValue={categoryOptions[0]?.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 md:flex-shrink-0">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onRefresh}
              className="rounded-full"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
                title="Chart settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Chart Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-refresh</h4>
                    <p className="text-sm text-muted-foreground">Automatically refresh data</p>
                  </div>
                  <Switch 
                    checked={autoRefresh}
                    onCheckedChange={handleAutoRefreshChange}
                  />
                </div>
                
                {autoRefresh && (
                  <div>
                    <h4 className="font-medium mb-2">Refresh Interval</h4>
                    <ToggleGroup type="single" value={refreshInterval} onValueChange={(value) => value && setRefreshInterval(value)}>
                      <ToggleGroupItem value="10">10s</ToggleGroupItem>
                      <ToggleGroupItem value="30">30s</ToggleGroupItem>
                      <ToggleGroupItem value="60">1m</ToggleGroupItem>
                      <ToggleGroupItem value="300">5m</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Chart View</h4>
                  <ToggleGroup type="single" value={chartView} onValueChange={(value) => value && setChartView(value)}>
                    <ToggleGroupItem value="line">Line</ToggleGroupItem>
                    <ToggleGroupItem value="bar">Bar</ToggleGroupItem>
                    <ToggleGroupItem value="candlestick">Candlestick</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;
