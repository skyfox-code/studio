
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        <CardTitle className="font-headline">
          System Log
        </CardTitle>
        <CardDescription>
          Live calculations from the thermostat.
        </CardDescription>
      </CardHeader>
      <CardContent className="font-mono text-sm">
        <div className="p-3 bg-muted/50 rounded-md space-y-1.5 overflow-x-auto">
          <p><span className="text-primary">SYS_INPUT &gt;</span> Current Temperature: <span className="font-semibold">{currentTemperature.toFixed(1)}°C</span></p>
          <p><span className="text-primary">SYS_INPUT &gt;</span> Current Humidity: <span className="font-semibold">{currentHumidity.toFixed(0)}%</span></p>
          <p><span className="text-primary">SYS_INPUT &gt;</span> Target Temperature: <span className="font-semibold">{targetTemperature.toFixed(1)}°C</span></p>
          <p><span className="text-primary">SYS_CONFIG &gt;</span> Deadband: <span className="font-semibold">±{deadband.toFixed(1)}°C</span></p>

          <Separator className="my-2 bg-border/70 !my-2.5" />

          {humidityEffectReasoningDisplay && (
            <p><span className="text-accent">CALC_STEP # </span> {humidityEffectReasoningDisplay}</p>
          )}
          <p><span className="text-accent">CALC_STEP # </span> Effective Temperature: <span className="font-semibold">{perceivedTemperatureDisplay !== null ? `${perceivedTemperatureDisplay.toFixed(1)}°C` : 'N/A'}</span></p>
          <p><span className="text-accent">CALC_STEP # </span> Temp Difference (Target - Effective): <span className="font-semibold">{temperatureDifferenceDisplay !== null ? `${temperatureDifferenceDisplay.toFixed(1)}°C` : 'N/A'}</span></p>

          <Separator className="my-2 bg-border/70 !my-2.5" />

          <p><span className="text-foreground">SYS_OUTPUT $ </span> Heating Output: <span className={`font-bold ${heatingOutput > 0 ? 'text-destructive' : 'text-foreground'}`}>{heatingOutput.toFixed(0)}%</span></p>
          <p><span className="text-foreground">SYS_OUTPUT $ </span> Cooling Output: <span className={`font-bold ${coolingOutput > 0 ? 'text-primary' : 'text-foreground'}`}>{coolingOutput.toFixed(0)}%</span></p>

          <Separator className="my-2 bg-border/70 !my-2.5" />
          
          {finalReasoning && (
            <p className="whitespace-pre-wrap"><span className="text-muted-foreground">REASONING ! </span> {finalReasoning}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

