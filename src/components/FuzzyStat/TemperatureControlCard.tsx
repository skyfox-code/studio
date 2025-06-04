
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TemperatureControlCardProps {
  desiredTemperature: number;
  onDesiredTemperatureChange: (value: number) => void;
  minTemp?: number;
  maxTemp?: number;
  step?: number;
  isDisabled?: boolean;
}

export function TemperatureControlCard({
  desiredTemperature,
  onDesiredTemperatureChange,
  minTemp = 10,
  maxTemp = 30,
  step = 0.5,
  isDisabled = false,
}: TemperatureControlCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Desired Temperature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <span className="text-5xl font-bold text-accent">{desiredTemperature.toFixed(1)}°C</span>
        </div>
        <Slider
          value={[desiredTemperature]}
          onValueChange={(value) => onDesiredTemperatureChange(value[0])}
          min={minTemp}
          max={maxTemp}
          step={step}
          aria-label="Desired temperature slider"
          disabled={isDisabled}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minTemp}°C</span>
          <span>{maxTemp}°C</span>
        </div>
      </CardContent>
    </Card>
  );
}

    