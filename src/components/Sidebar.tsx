
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Cloud, 
  Home, 
  LineChart, 
  PieChart, 
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar = ({ isOpen, activeItem, setActiveItem }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'lineChart', label: 'Line Chart', icon: LineChart },
    { id: 'barChart', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pieChart', label: 'Pie Chart', icon: PieChart },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'crypto', label: 'Crypto Market', icon: RefreshCw },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-64 transform flex-col bg-background transition-all duration-300 md:flex ${
          collapsed ? '-translate-x-[180px]' : 'translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-auto py-6">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.id}
                    variant={activeItem === item.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      activeItem === item.id ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    <span className={`${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-10 h-8 w-8 rounded-full border bg-background"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background p-6 shadow-lg transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "default" : "ghost"}
                  className="w-full justify-start text-left"
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
    </>
  );
};

export default Sidebar;
