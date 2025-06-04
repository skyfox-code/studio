
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Thermometer, Droplets, Target, Brain, TrendingUp, TrendingDown, Info } from "lucide-react";

interface FuzzyLogicDisplayCardProps {
  currentTemperature: number;
  currentHumidity: number;
  targetTemperature: number;
  perceivedTemperatureDisplay: number | null;
  temperatureDifferenceDisplay: number | null;
  humidityEffectReasoningDisplay: string | null;
  heatingOutput: number;
  coolingOutput: number;
  finalReasoning: string | null;
  deadband: number;
}

export function FuzzyLogicDisplayCard({
  currentTemperature,
  currentHumidity,
  targetTemperature,
  perceivedTemperatureDisplay,
  temperatureDifferenceDisplay,
  humidityEffectReasoningDisplay,
  heatingOutput,
  coolingOutput,
  finalReasoning,
  deadband,
}: FuzzyLogicDisplayCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Brain className="h-6 w-6 mr-2 text-primary" />
          Logic Details
        </CardTitle>
        <CardDescription>
          How the thermostat makes decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <h4 className="font-semibold mb-1 text-base">Inputs:</h4>
          <div className="pl-2 space-y-1 border-l-2 border-muted ml-1">
            <p className="flex items-center"><Thermometer className="h-4 w-4 mr-2 text-accent" /> Current Temp: {currentTemperature.toFixed(1)}°C</p>
            <p className="flex items-center"><Droplets className="h-4 w-4 mr-2 text-primary" /> Current Humidity: {currentHumidity.toFixed(0)}%</p>
            <p className="flex items-center"><Target className="h-4 w-4 mr-2 text-accent" /> Target Temp: {targetTemperature.toFixed(1)}°C</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-1 text-base">Intermediate Calculations:</h4>
          <div className="pl-2 space-y-1 border-l-2 border-muted ml-1">
            {humidityEffectReasoningDisplay && (
              <p><span className="font-medium">Humidity Effect:</span> {humidityEffectReasoningDisplay}</p>
            )}
             <p><span className="font-medium">Effective Temperature:</span> {perceivedTemperatureDisplay !== null ? `${perceivedTemperatureDisplay.toFixed(1)}°C` : 'N/A'}</p>
            <p><span className="font-medium">Temp Difference (Target - Effective):</span> {temperatureDifferenceDisplay !== null ? `${temperatureDifferenceDisplay.toFixed(1)}°C` : 'N/A'}</p>
            <p><span className="font-medium">Deadband:</span> ±{deadband.toFixed(1)}°C</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-1 text-base">Outputs:</h4>
           <div className="pl-2 space-y-1 border-l-2 border-muted ml-1">
            <p className="flex items-center"><TrendingUp className="h-4 w-4 mr-2 text-destructive" /> Heating Output: {heatingOutput.toFixed(0)}%</p>
            <p className="flex items-center"><TrendingDown className="h-4 w-4 mr-2 text-primary" /> Cooling Output: {coolingOutput.toFixed(0)}%</p>
          </div>
        </div>

        {finalReasoning && (
          <div>
            <h4 className="font-semibold mb-1 text-base flex items-center">
              <Info className="h-5 w-5 mr-2 text-foreground" />
              System Reasoning:
            </h4>
            <p className="pl-2 border-l-2 border-muted ml-1 italic text-muted-foreground">{finalReasoning}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
