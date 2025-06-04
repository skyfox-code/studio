
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";


interface CurrentReadingsCardProps {
  temperature: number;
  humidity: number;
  dataSource: 'manual' | 'open-meteo';
  onDataSourceChange: (value: 'manual' | 'open-meteo') => void;
  isFetchingWeatherData?: boolean;
  weatherApiError?: string | null;
}

export function CurrentReadingsCard({
  temperature,
  humidity,
  dataSource,
  onDataSourceChange,
  isFetchingWeatherData,
  weatherApiError
}: CurrentReadingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Current Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="dataSourceSelect">Data Source</Label>
          <Select
            value={dataSource}
            onValueChange={(value: 'manual' | 'open-meteo') => onDataSourceChange(value)}
            disabled={isFetchingWeatherData}
            name="dataSourceSelect"
          >
            <SelectTrigger id="dataSourceSelect" className="w-full">
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Input</SelectItem>
              <SelectItem value="open-meteo">Live Weather (Open-Meteo)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dataSource === 'open-meteo' && weatherApiError && (
          <Alert variant="destructive" className="py-2 px-3">
            <AlertDescription className="text-xs">
              Error fetching live data: {weatherApiError}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-6 w-6 text-accent" />
            <span className="text-lg">Temperature</span>
            {dataSource === 'open-meteo' && isFetchingWeatherData && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          <span className="text-2xl font-bold">{temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="text-lg">Humidity</span>
             {dataSource === 'open-meteo' && isFetchingWeatherData && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          <span className="text-2xl font-bold">{humidity.toFixed(0)}%</span>
        </div>
         {dataSource === 'open-meteo' && !isFetchingWeatherData && !weatherApiError && (
          <p className="text-xs text-muted-foreground text-center pt-1">Live data from Open-Meteo (London, UK)</p>
        )}
      </CardContent>
    </Card>
  );
}
