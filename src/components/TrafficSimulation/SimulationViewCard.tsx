
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';
import { CarFront, Clock4, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Dynamically import ViennaMap with ssr: false
const ViennaMap: ComponentType<Record<string, never>> = dynamic(
  () => import('./ViennaMap').then((mod) => mod.ViennaMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);


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
        <div className="w-full h-[400px] md:h-[500px] lg:h-full min-h-[300px] rounded-lg shadow-md border overflow-hidden">
          <ViennaMap />
        </div>
      </CardContent>
    </Card>
  );
}
