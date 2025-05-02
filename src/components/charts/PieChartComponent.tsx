
import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { fetchMarketAllocation } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

Chart.register(...registerables);

interface PieChartProps {
  timeRange: string;
  category: string;
}

const PieChartComponent = ({ timeRange, category }: PieChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Get real data from our API service
        const segments = await fetchMarketAllocation(timeRange, category);
        
        if (chartRef.current) {
          // Destroy existing chart if it exists
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
          
          const ctx = chartRef.current.getContext('2d');
          if (!ctx) return;
         
          chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: segments.map(segment => segment.name),
              datasets: [
                {
                  data: segments.map(segment => segment.value),
                  backgroundColor: segments.map(segment => segment.color || 'rgba(59, 130, 246, 0.8)'),
                  borderColor: segments.map(segment => 
                    segment.color ? segment.color.replace('0.8', '1') : 'rgb(59, 130, 246)'
                  ),
                  borderWidth: 1,
                  hoverOffset: 15,
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
                  callbacks: {
                    label: function(context) {
                      const value = context.parsed;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${context.label}: ${percentage}%`;
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
                    padding: 20,
                  },
                },
              },
              animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeOutQuad',
              },
            },
          });
          
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error creating pie chart:', err);
        setError('Failed to load chart data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, category]);
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'allocation':
        return 'Market Sector Allocation';
      case 'distribution':
        return 'Geographic Distribution';
      case 'segments':
        return 'Customer Segments';
      default:
        return 'Market Distribution';
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

export default PieChartComponent;
