
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { CarFront, Clock4, TrafficCone } from "lucide-react";

type TrafficLevel = "Light" | "Moderate" | "Heavy" | "Standstill";
interface TrafficZone {
  id: string;
  name: string;
  currentLevel: TrafficLevel;
}

interface SimulationViewCardProps {
  simulatedTime: Date;
  trafficZones: TrafficZone[];
}

const trafficLevelColors: Record<TrafficLevel, string> = {
  Light: "bg-green-500 hover:bg-green-600",
  Moderate: "bg-yellow-500 hover:bg-yellow-600",
  Heavy: "bg-orange-500 hover:bg-orange-600",
  Standstill: "bg-red-600 hover:bg-red-700",
};

export function SimulationViewCard({ simulatedTime, trafficZones }: SimulationViewCardProps) {
  const formattedTime = format(simulatedTime, 'HH:mm');
  const formattedDate = format(simulatedTime, 'eeee, MMMM do');


  const getTrafficIcon = (level: TrafficLevel) => {
    switch(level) {
      case "Light": return <CarFront className="h-4 w-4 mr-1.5 text-green-100"/>;
      case "Moderate": return <CarFront className="h-4 w-4 mr-1.5 text-yellow-100"/>;
      case "Heavy": return <TrafficCone className="h-4 w-4 mr-1.5 text-orange-100"/>;
      case "Standstill": return <TrafficCone className="h-4 w-4 mr-1.5 text-red-100"/>;
      default: return <CarFront className="h-4 w-4 mr-1.5"/>;
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <CarFront className="mr-2 h-6 w-6 text-primary"/>
             Live Traffic Status - Vienna
        </CardTitle>
        <CardDescription className="flex items-center">
            <Clock4 className="mr-1.5 h-4 w-4 text-muted-foreground"/>
            Current Simulated Time: <span className="font-semibold text-accent ml-1">{formattedTime}</span>
            <span className="text-muted-foreground ml-2">({formattedDate})</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trafficZones.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Simulation not started or no zones defined.</p>
        ) : (
          <div className="space-y-3">
            {trafficZones.map((zone) => (
              <div key={zone.id} className="p-3 border rounded-lg shadow-sm bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-card-foreground">{zone.name}</h3>
                  <Badge className={`text-xs text-white ${trafficLevelColors[zone.currentLevel]}`}>
                     {getTrafficIcon(zone.currentLevel)}
                     {zone.currentLevel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
