
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchRevenueData } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

Chart.register(...registerables);

interface BarChartProps {
  timeRange: string;
  category: string;
}

const BarChartComponent = ({ timeRange, category }: BarChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Get real data from our API service
        const revenueData = await fetchRevenueData(timeRange, category);
        
        if (chartRef.current) {
          // Destroy existing chart if it exists
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
          
          const ctx = chartRef.current.getContext('2d');
          if (!ctx) return;
          
          const dataset = revenueData.datasets[0];
          
          chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: revenueData.labels,
              datasets: [
                {
                  label: dataset.label,
                  data: dataset.data,
                  backgroundColor: dataset.color || 'rgba(16, 185, 129, 0.8)',
                  borderColor: dataset.color ? dataset.color.replace('0.8', '1') : 'rgb(16, 185, 129)',
                  borderWidth: 1,
                  borderRadius: 4,
                  hoverBackgroundColor: dataset.color ? dataset.color.replace('0.8', '1') : 'rgba(16, 185, 129, 1)',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
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
                        label += `$${context.parsed.y.toFixed(2)}M`;
                      }
                      return label;
                    }
                  }
                },
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
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                  ticks: {
                    callback: function(value) {
                      return `$${value}M`;
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
        console.error('Error creating bar chart:', err);
        setError('Failed to load chart data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, category]);

  const getCategoryTitle = () => {
    switch (category) {
      case 'revenue':
        return 'Quarterly Revenue';
      case 'expenses':
        return 'Quarterly Expenses';
      case 'profit':
        return 'Quarterly Profit';
      default:
        return 'Financial Analysis';
    }
  };

  return (
    <Card className="chart-container">
      <CardContent className="p-4">
        <h2 className="mb-4 text-xl font-semibold">{getCategoryTitle()}</h2>
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

export default BarChartComponent;
