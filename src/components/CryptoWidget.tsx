
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Loader, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { fetchCryptoData, CoinData } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CryptoDisplayData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  marketCap?: number;
  volume?: number;
  image: string;
}

const CryptoWidget = () => {
  const [cryptoData, setCryptoData] = useState<CryptoDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('price');

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const data = await fetchCryptoData();
      
      // Process the data to enhance it for display
      const enhancedData = data.map(coin => {
        return {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap / 1000000, // Convert to millions
          volume: coin.total_volume / 1000000, // Convert to millions
          image: coin.image
        };
      });
      
      setCryptoData(enhancedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Unable to fetch cryptocurrency data');
      toast.error('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh crypto data every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchData();
    toast.success('Cryptocurrency data refreshed');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 10 ? 2 : 0,
      maximumFractionDigits: price < 10 ? 6 : 2
    }).format(price);
  };

  const formatLargeNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
    return `$${num.toFixed(2)}M`;
  };

  if (loading && !cryptoData.length) {
    return (
      <Card className="w-full h-full">
        <CardContent className="p-6 flex justify-center items-center min-h-[220px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error && !cryptoData.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex justify-center items-center min-h-[220px]">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Cryptocurrency Market</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : ''}
            </span>
            <Button 
              variant="ghost"
              size="icon"
              onClick={handleRefresh} 
              disabled={refreshing}
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="marketCap">Market Cap</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3 rounded-full" />
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(crypto.current_price)}</p>
                  <p className={`text-xs flex items-center justify-end ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-1" /> : 
                      <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="marketCap" className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3 rounded-full" />
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatLargeNumber(crypto.marketCap)}</p>
                  <p className={`text-xs flex items-center justify-end ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? 
                      <ArrowUp className="h-3 w-3 mr-1" /> : 
                      <ArrowDown className="h-3 w-3 mr-1" />} 
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3 rounded-full" />
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatLargeNumber(crypto.volume)}</p>
                  <p className="text-xs text-muted-foreground">24h Trading Volume</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CryptoWidget;
