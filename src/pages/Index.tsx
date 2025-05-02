
import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Cloud, 
  Home, 
  LineChart, 
  PieChart, 
  RefreshCw 
} from 'lucide-react';

const Index = () => {
  const [activeItem, setActiveItem] = useState('overview');
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'lineChart', label: 'Line Chart', icon: LineChart },
    { id: 'barChart', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pieChart', label: 'Pie Chart', icon: PieChart },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'crypto', label: 'Crypto Market', icon: RefreshCw },
  ];

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        {/* Horizontal Navigation */}
        <div className="border-b bg-background sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-2 space-x-2 no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.id}
                    variant={activeItem === item.id ? "default" : "ghost"}
                    className="flex-shrink-0"
                    onClick={() => setActiveItem(item.id)}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
          
        <main className="flex-1 w-full overflow-auto p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0">
          <div className="container mx-auto py-6">
            <Dashboard activeItem={activeItem} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
