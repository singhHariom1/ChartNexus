
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchStockData } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

Chart.register(...registerables);

interface LineChartProps {
  timeRange: string;
  category: string;
}

const LineChartComponent = ({ timeRange, category }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Get real data from our API service
        const stockData = await fetchStockData('MSFT', timeRange);
        
        if (chartRef.current) {
          // Destroy existing chart if it exists
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
          
          const ctx = chartRef.current.getContext('2d');
          if (!ctx) return;
          
          // Create gradient for fill
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
          gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.1)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          const datasetIndex = category === 'volume' ? 1 : 0;
          const selectedDataset = stockData.datasets[datasetIndex];
          
          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: stockData.labels,
              datasets: [
                {
                  label: selectedDataset.label,
                  data: selectedDataset.data,
                  borderColor: selectedDataset.color || 'rgb(59, 130, 246)',
                  backgroundColor: gradient,
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: selectedDataset.color || 'rgb(59, 130, 246)',
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'nearest',
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    font: {
                      size: 13,
                    },
                    usePointStyle: true,
                    padding: 20,
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  padding: 10,
                  titleFont: {
                    size: 14,
                    weight: 'bold',
                  },
                  bodyFont: {
                    size: 13,
                  },
                  displayColors: false,
                  callbacks: {
                    label: function(context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += category === 'volume' ? 
                          `${context.parsed.y.toFixed(1)}M` : 
                          `$${context.parsed.y.toFixed(2)}`;
                      }
                      return label;
                    }
                  }
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: false,
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                  ticks: {
                    callback: function(value) {
                      return category === 'volume' ? `${value}M` : `$${value}`;
                    }
                  }
                },
              },
              animation: {
                duration: 1000,
                easing: 'easeOutQuad',
              },
            },
          });
          
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error creating line chart:', err);
        setError('Failed to load chart data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, category]);

  return (
    <Card className="chart-container">
      <CardContent className="p-4">
        <h2 className="mb-4 text-xl font-semibold">
          {category === 'volume' ? 'Trading Volume' : 'Microsoft Stock Price'}
        </h2>
        <div className="relative h-[400px] w-full">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-destructive">{error}</p>
                <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
              </div>
            </div>
          )}
          <canvas ref={chartRef} height={400}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;
