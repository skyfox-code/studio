
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';
import { CarFront, Clock4 } from "lucide-react";
import { ViennaMap } from './ViennaMap'; // Import the new map component
// TrafficZone type and trafficLevelColors might be reused later for map overlays
// type TrafficLevel = "Light" | "Moderate" | "Heavy" | "Standstill";
// interface TrafficZone {
//   id: string;
//   name: string;
//   currentLevel: TrafficLevel;
// }

interface SimulationViewCardProps {
  simulatedTime: Date;
  // trafficZones: TrafficZone[]; // Temporarily removed, will be used for map data later
}

export function SimulationViewCard({ simulatedTime }: SimulationViewCardProps) {
  const formattedTime = format(simulatedTime, 'HH:mm');
  const formattedDate = format(simulatedTime, 'eeee, MMMM do');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline flex items-center">
            <CarFront className="mr-2 h-6 w-6 text-primary"/>
             Live Traffic Status - Vienna
        </CardTitle>
        <CardDescription className="flex items-center pt-1">
            <Clock4 className="mr-1.5 h-4 w-4 text-muted-foreground"/>
            Current Simulated Time: <span className="font-semibold text-accent ml-1">{formattedTime}</span>
            <span className="text-muted-foreground ml-2">({formattedDate})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4 pt-2">
        {/* Replace the list of zones with the ViennaMap component */}
        <ViennaMap />
        {/* 
          The previous list of zones:
          {trafficZones.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Simulation not started or no zones defined.</p>
          ) : (
            <div className="space-y-3">
              {trafficZones.map((zone) => (
                // ... zone item rendering ...
              ))}
            </div>
          )} 
        */}
      </CardContent>
    </Card>
  );
}
