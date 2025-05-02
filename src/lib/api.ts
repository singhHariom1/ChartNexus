
import { toast } from "@/components/ui/sonner";

export interface StockData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface MarketSegment {
  name: string;
  value: number;
  color?: string;
}

export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

// Fetch stock market data from Finnhub
export const fetchStockData = async (symbol: string, timeRange: string): Promise<StockData> => {
  try {
    const resolution = timeRange === '1d' ? '5' : 
                        timeRange === '7d' ? 'D' : 
                        timeRange === '1m' ? 'W' : 'M';
                        
    const now = Math.floor(Date.now() / 1000);
    let from: number;
    
    switch (timeRange) {
      case '1d':
        from = now - 86400; // 1 day in seconds
        break;
      case '7d':
        from = now - 604800; // 7 days in seconds
        break;
      case '1m':
        from = now - 2592000; // 30 days in seconds
        break;
      case '3m':
        from = now - 7776000; // 90 days in seconds
        break;
      default:
        from = now - 31536000; // 365 days in seconds
    }
    
    // Since we're simulating the API call (Finnhub API requires authentication)
    // we'll create realistic but simulated data based on the timeRange
    const dataPoints = timeRange === '1d' ? 24 : 
                       timeRange === '7d' ? 7 : 
                       timeRange === '1m' ? 30 : 
                       timeRange === '3m' ? 12 : 52;
    
    const labels: string[] = [];
    const priceData: number[] = [];
    const volumeData: number[] = [];
    
    // Generate timestamps and data
    const basePrice = symbol === 'AAPL' ? 180 : 
                     symbol === 'MSFT' ? 380 : 
                     symbol === 'GOOGL' ? 140 : 100;
    
    const baseVolume = symbol === 'AAPL' ? 70000000 : 
                      symbol === 'MSFT' ? 30000000 : 
                      symbol === 'GOOGL' ? 20000000 : 10000000;
    
    const volatility = timeRange === '1d' ? 0.005 : 
                       timeRange === '7d' ? 0.01 : 
                       timeRange === '1m' ? 0.05 : 0.1;
    
    let currentPrice = basePrice;
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date(from * 1000 + (i * ((now - from) * 1000 / dataPoints)));
      
      if (timeRange === '1d') {
        labels.push(date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}));
      } else if (timeRange === '7d') {
        labels.push(date.toLocaleDateString('en-US', {weekday: 'short'}));
      } else {
        labels.push(date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}));
      }
      
      // Simulate price movements
      const change = (Math.random() - 0.45) * volatility * currentPrice;
      currentPrice = Math.max(basePrice * 0.7, currentPrice + change);
      priceData.push(Number(currentPrice.toFixed(2)));
      
      // Simulate volume
      volumeData.push(Math.round(baseVolume * (0.7 + Math.random() * 0.6)));
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Price',
          data: priceData,
          color: '#3b82f6'
        },
        {
          label: 'Volume',
          data: volumeData.map(v => v / 1000000), // Convert to millions for better visualization
          color: '#10b981'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    toast.error('Failed to load stock market data');
    throw error;
  }
};

// Fetch revenue data for companies
export const fetchRevenueData = async (timeRange: string, category: string): Promise<StockData> => {
  try {
    // We're simulating API data here
    const dataPoints = timeRange === '1d' ? 4 : 
                      timeRange === '7d' ? 7 : 
                      timeRange === '1m' ? 4 : 
                      timeRange === '3m' ? 3 : 4;
    
    const labels: string[] = [];
    const revenueData: number[] = [];
    const expenseData: number[] = [];
    const profitData: number[] = [];
    
    // Generate quarterly/yearly labels
    if (timeRange === '1d') {
      labels.push('Q1', 'Q2', 'Q3', 'Q4');
    } else if (timeRange === '7d') {
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.unshift(date.toLocaleDateString('en-US', {weekday: 'short'}));
      }
    } else if (timeRange === '1y') {
      labels.push('Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024');
    } else {
      const currentYear = new Date().getFullYear();
      for (let i = 0; i < dataPoints; i++) {
        labels.push(`Q${(i % 4) + 1} ${currentYear - Math.floor(i / 4)}`);
      }
      labels.reverse();
    }
    
    // Different base values depending on the category
    const baseRevenue = category === 'revenue' ? 850 : 
                        category === 'expenses' ? 500 : 700;
    const baseExpense = category === 'revenue' ? 600 : 
                        category === 'expenses' ? 450 : 500;
    
    for (let i = 0; i < labels.length; i++) {
      // Generate realistic looking financial data with growth trend
      const growthFactor = 1 + (i * 0.03); // 3% growth per period
      
      const revenue = baseRevenue * growthFactor * (0.9 + Math.random() * 0.2);
      revenueData.push(Number(revenue.toFixed(2)));
      
      const expense = baseExpense * growthFactor * (0.9 + Math.random() * 0.2);
      expenseData.push(Number(expense.toFixed(2)));
      
      const profit = revenue - expense;
      profitData.push(Number(profit.toFixed(2)));
    }
    
    if (category === 'revenue') {
      return {
        labels,
        datasets: [{ label: 'Revenue', data: revenueData, color: '#10b981' }]
      };
    } else if (category === 'expenses') {
      return {
        labels,
        datasets: [{ label: 'Expenses', data: expenseData, color: '#ef4444' }]
      };
    } else {
      return {
        labels,
        datasets: [{ label: 'Profit', data: profitData, color: '#8b5cf6' }]
      };
    }
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    toast.error('Failed to load revenue data');
    throw error;
  }
};

// Fetch market allocation data
export const fetchMarketAllocation = async (timeRange: string, category: string): Promise<MarketSegment[]> => {
  try {
    // Simulate market allocation data based on category
    if (category === 'allocation') {
      return [
        { name: 'Technology', value: 35, color: 'rgba(59, 130, 246, 0.8)' },
        { name: 'Healthcare', value: 20, color: 'rgba(16, 185, 129, 0.8)' },
        { name: 'Finance', value: 18, color: 'rgba(245, 158, 11, 0.8)' },
        { name: 'Consumer', value: 15, color: 'rgba(239, 68, 68, 0.8)' },
        { name: 'Energy', value: 7, color: 'rgba(139, 92, 246, 0.8)' },
        { name: 'Other', value: 5, color: 'rgba(20, 184, 166, 0.8)' },
      ];
    } else if (category === 'distribution') {
      return [
        { name: 'North America', value: 45, color: 'rgba(59, 130, 246, 0.8)' },
        { name: 'Europe', value: 25, color: 'rgba(16, 185, 129, 0.8)' },
        { name: 'Asia Pacific', value: 20, color: 'rgba(245, 158, 11, 0.8)' },
        { name: 'Latin America', value: 7, color: 'rgba(239, 68, 68, 0.8)' },
        { name: 'Africa', value: 3, color: 'rgba(139, 92, 246, 0.8)' },
      ];
    } else {
      return [
        { name: 'Enterprise', value: 38, color: 'rgba(59, 130, 246, 0.8)' },
        { name: 'SMB', value: 32, color: 'rgba(16, 185, 129, 0.8)' },
        { name: 'Consumer', value: 22, color: 'rgba(245, 158, 11, 0.8)' },
        { name: 'Government', value: 8, color: 'rgba(239, 68, 68, 0.8)' },
      ];
    }
  } catch (error) {
    console.error('Error fetching market allocation data:', error);
    toast.error('Failed to load market allocation data');
    throw error;
  }
};

// Fetch top cryptocurrencies data from CoinGecko API
export const fetchCryptoData = async (): Promise<CoinData[]> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrency data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    toast.error('Failed to load cryptocurrency data');
    throw error;
  }
};

// Fetch weather data from OpenWeatherMap API
export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const fetchWeatherData = async (city: string = 'London'): Promise<WeatherData> => {
  try {
    const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // This is a free public API key for demo purposes
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    toast.error('Failed to load weather data');
    throw error;
  }
};
