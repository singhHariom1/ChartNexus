// Helper function to generate random data
const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate dates based on time range
const generateDateLabels = (timeRange: string) => {
  const today = new Date();
  const labels: string[] = [];
  let days: number;

  switch (timeRange) {
    case '1d':
      // 24 hours with hourly labels
      for (let i = 0; i < 24; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        labels.push(`${hour}${ampm}`);
      }
      return labels;
    case '7d':
      days = 7;
      break;
    case '1m':
      days = 30;
      break;
    case '3m':
      days = 90;
      break;
    case '1y':
      // Monthly labels for 1 year
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const currentMonth = today.getMonth();
      
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(months[monthIndex]);
      }
      return labels;
    default:
      days = 7;
  }

  // Generate daily labels
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  
  return labels;
};

// Generate data for time series charts
export const generateDummyTimeData = (timeRange: string, category: string) => {
  const labels = generateDateLabels(timeRange);
  const data: number[] = [];
  
  // Generate different data patterns based on category
  let baseValue;
  let volatility;
  
  switch (category) {
    case 'price':
      baseValue = 50000;
      volatility = 2000;
      break;
    case 'volume':
      baseValue = 2000000;
      volatility = 500000;
      break;
    case 'marketCap':
      baseValue = 900000000;
      volatility = 50000000;
      break;
    default:
      baseValue = 1000;
      volatility = 200;
  }
  
  // Generate data with some trend
  let currentValue = baseValue;
  for (let i = 0; i < labels.length; i++) {
    const change = (Math.random() - 0.48) * volatility; // Slight upward bias
    currentValue += change;
    currentValue = Math.max(currentValue, baseValue * 0.5); // Prevent too low values
    data.push(Math.round(currentValue));
  }
  
  return { labels, data };
};

// Generate data for bar charts
export const generateDummyBarData = (timeRange: string, category: string) => {
  const labels = generateDateLabels(timeRange);
  const data: number[] = [];
  
  // Generate different data patterns based on category
  let baseValue;
  let volatility;
  
  switch (category) {
    case 'revenue':
      baseValue = 200000;
      volatility = 50000;
      break;
    case 'expenses':
      baseValue = 150000;
      volatility = 30000;
      break;
    case 'profit':
      baseValue = 50000;
      volatility = 20000;
      break;
    default:
      baseValue = 100000;
      volatility = 25000;
  }
  
  // Generate bar chart data
  for (let i = 0; i < labels.length; i++) {
    const value = baseValue + (Math.random() - 0.5) * volatility * 2;
    data.push(Math.round(value));
  }
  
  return { labels, data };
};

// Generate data for pie charts
export const generateDummyPieData = (timeRange: string, category: string) => {
  let labels: string[] = [];
  let data: number[] = [];
  
  switch (category) {
    case 'allocation':
      labels = ['Stocks', 'Bonds', 'Cash', 'Real Estate', 'Commodities', 'Crypto'];
      data = [35, 25, 15, 10, 10, 5];
      break;
    case 'distribution':
      labels = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
      data = [45, 25, 20, 5, 5];
      break;
    case 'segments':
      labels = ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Utilities'];
      data = [30, 20, 15, 15, 10, 10];
      break;
    default:
      labels = ['Category A', 'Category B', 'Category C', 'Category D'];
      data = [40, 30, 20, 10];
  }
  
  // Add some randomization to the data while keeping the sum at 100
  if (timeRange !== 'default') {
    const perturbation = 3; // Max percentage points to adjust by
    
    // Create perturbed data
    const newData = data.map(value => {
      const change = (Math.random() * perturbation * 2) - perturbation;
      return Math.max(1, value + change); // Ensure no negative or zero values
    });
    
    // Normalize to ensure sum is 100
    const sum = newData.reduce((acc, val) => acc + val, 0);
    data = newData.map(value => Math.round((value / sum) * 100));
    
    // Ensure sum is exactly 100 by adjusting the largest value
    const currentSum = data.reduce((acc, val) => acc + val, 0);
    const largestValueIndex = data.indexOf(Math.max(...data));
    data[largestValueIndex] += (100 - currentSum);
  }
  
  return { labels, data };
};
