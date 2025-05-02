import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudSun,
  Loader,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWeatherData, WeatherData } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("London");
  const [refreshing, setRefreshing] = useState(false);

  const cities = [
    { value: "London", label: "London" },
    { value: "New York", label: "New York" },
    { value: "Tokyo", label: "Tokyo" },
    { value: "Sydney", label: "Sydney" },
    { value: "Paris", label: "Paris" },
  ];

  const fetchData = async (selectedCity: string) => {
    try {
      setRefreshing(true);
      const data = await fetchWeatherData(selectedCity);
      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Unable to fetch weather data");
      toast.error(`Failed to load weather data for ${selectedCity}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(city);

    // Refresh weather data every 10 minutes
    const intervalId = setInterval(() => fetchData(city), 600000);

    return () => clearInterval(intervalId);
  }, [city]);

  const handleRefresh = () => {
    fetchData(city);
    toast.success("Weather data refreshed");
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setLoading(true);
  };

  const getWeatherIcon = () => {
    if (!weatherData) return <Cloud className="h-12 w-12 text-blue-500" />;

    const iconCode = weatherData.icon;

    if (iconCode.includes("01"))
      return <Sun className="h-12 w-12 text-yellow-500" />;
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return <CloudSun className="h-12 w-12 text-blue-500" />;
    if (iconCode.includes("09") || iconCode.includes("10"))
      return <CloudRain className="h-12 w-12 text-blue-700" />;
    if (iconCode.includes("13"))
      return <CloudSnow className="h-12 w-12 text-blue-300" />;
    if (iconCode.includes("50"))
      return <Wind className="h-12 w-12 text-gray-500" />;

    return <Cloud className="h-12 w-12 text-blue-500" />;
  };

  const getGradientByWeather = () => {
    if (!weatherData) return "from-blue-500 to-blue-600";

    const iconCode = weatherData.icon;

    if (iconCode.includes("01")) return "from-yellow-400 to-orange-500";
    if (
      iconCode.includes("02") ||
      iconCode.includes("03") ||
      iconCode.includes("04")
    )
      return "from-blue-400 to-blue-600";
    if (iconCode.includes("09") || iconCode.includes("10"))
      return "from-blue-600 to-blue-800";
    if (iconCode.includes("13")) return "from-blue-200 to-blue-400";
    if (iconCode.includes("50")) return "from-gray-400 to-gray-600";

    return "from-blue-500 to-blue-600";
  };

  if (loading && !weatherData) {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6 flex justify-center items-center min-h-[220px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error && !weatherData) {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6 flex justify-center items-center min-h-[220px]">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <p className="text-muted-foreground text-sm mt-2">
              Please try again later
            </p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className={`bg-gradient-to-br ${getGradientByWeather()} text-white`}>
        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <Select value={city} onValueChange={handleCityChange}>
                <SelectTrigger className="w-[150px] bg-white/20 border-white/30 focus:ring-white text-white">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-white hover:bg-white/20"
              disabled={refreshing || loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              {getWeatherIcon()}
              <div className="ml-4">
                <p className="text-4xl font-bold mb-1">
                  {weatherData?.temperature}°C
                </p>
                <p className="capitalize opacity-90">
                  {weatherData?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <p className="text-xs opacity-80">Humidity</p>
                <p className="text-lg font-medium">{weatherData?.humidity}%</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <p className="text-xs opacity-80">Wind</p>
                <p className="text-lg font-medium">
                  {weatherData?.windSpeed} m/s
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default WeatherWidget;
