"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets } from "lucide-react";

interface CurrentReadingsCardProps {
  temperature: number;
  humidity: number;
}

export function CurrentReadingsCard({ temperature, humidity }: CurrentReadingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Current Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-6 w-6 text-accent" />
            <span className="text-lg">Temperature</span>
          </div>
          <span className="text-2xl font-bold">{temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="text-lg">Humidity</span>
          </div>
          <span className="text-2xl font-bold">{humidity.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
