
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Clock, Zap } from "lucide-react";

interface TrafficControlsCardProps {
  simulatedTime: string; // HH:mm format
  onTimeChange: (newTime: string) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationSpeed: number; // in simulated minutes per real second
  onSimulationSpeedChange: (speed: number) => void;
}

export function TrafficControlsCard({
  simulatedTime,
  onTimeChange,
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onSimulationSpeedChange,
}: TrafficControlsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <Clock className="mr-2 h-6 w-6 text-primary"/>
            Simulation Controls
        </CardTitle>
        <CardDescription>Adjust time, speed, and manage the simulation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="simTime">Set Current Time (HH:MM)</Label>
          <Input
            id="simTime"
            type="time"
            value={simulatedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="mt-1"
            disabled={isSimulating}
          />
        </div>

        <div>
          <Label htmlFor="simSpeed">Simulation Speed: {simulationSpeed} min/sec</Label>
          <Slider
            id="simSpeed"
            min={1} // 1 simulated minute per second
            max={60} // 60 simulated minutes (1 hour) per second
            step={1}
            value={[simulationSpeed]}
            onValueChange={(value) => onSimulationSpeedChange(value[0])}
            className="mt-2"
            disabled={isSimulating}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Fast (1m/s)</span>
            <span>Slow (60m/s)</span>
          </div>
        </div>

        <Button onClick={onToggleSimulation} className="w-full" variant={isSimulating ? "destructive" : "brand"}>
          {isSimulating ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
          {isSimulating ? "Pause Simulation" : "Start Simulation"}
        </Button>
      </CardContent>
    </Card>
  );
}

    