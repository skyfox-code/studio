
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { TrafficSimHeader } from '@/components/TrafficSimulation/TrafficSimHeader';
import { TrafficControlsCard } from '@/components/TrafficSimulation/TrafficControlsCard';
import { SimulationViewCard } from '@/components/TrafficSimulation/SimulationViewCard';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { addMinutes, format } from 'date-fns';

type TrafficLevel = "Light" | "Moderate" | "Heavy" | "Standstill";
interface TrafficZone {
  id: string;
  name: string;
  currentLevel: TrafficLevel;
}

const ZONES_IN_VIENNA: Omit<TrafficZone, 'currentLevel'>[] = [
  { id: "ringstrasse", name: "Ringstraße"},
  { id: "gurtel", name: "Gürtel"},
  { id: "tangente", name: "Südosttangente A23"},
  { id: "donaukanal", name: "Donaukanal (Franz-Josefs-Kai/Obere Donaustr.)"},
  { id: "mariahilfer", name: "Mariahilfer Straße"},
  { id: "inner_bezirke", name: "Inner Districts (1-9)"},
  { id: "outer_bezirke", name: "Outer Districts (10-23)"},
];

const getBaseTrafficLevel = (hour: number, minute: number, day: number): TrafficLevel => {
  // Rush hours: Mon-Fri 7-9 AM and 4-6 PM
  const isRushHour = day >= 1 && day <= 5 && 
                     ((hour >= 7 && hour < 9) || (hour >= 16 && hour < 18));
  // Peak shopping times: Sat 11 AM - 3 PM
  const isShoppingPeak = day === 6 && (hour >= 11 && hour < 15);
  // Night time: 10 PM - 5 AM
  const isNightTime = hour >= 22 || hour < 5;

  if (isNightTime) return "Light";
  if (isRushHour) return "Heavy";
  if (isShoppingPeak) return "Moderate";
  if (hour >= 9 && hour < 16) return "Moderate"; // Daytime non-rush

  return "Light"; // Default
};

const getRandomizedLevel = (baseLevel: TrafficLevel): TrafficLevel => {
  const rand = Math.random();
  if (baseLevel === "Light") {
    if (rand < 0.7) return "Light"; // 70% chance stays light
    if (rand < 0.95) return "Moderate"; // 25% chance becomes moderate
    return "Heavy"; // 5% chance becomes heavy
  }
  if (baseLevel === "Moderate") {
    if (rand < 0.1) return "Light"; // 10%
    if (rand < 0.8) return "Moderate"; // 70%
    if (rand < 0.95) return "Heavy"; // 15%
    return "Standstill"; // 5%
  }
  if (baseLevel === "Heavy") {
    if (rand < 0.05) return "Moderate"; // 5%
    if (rand < 0.7) return "Heavy"; // 65%
    return "Standstill"; // 30%
  }
  if (baseLevel === "Standstill") {
    if (rand < 0.2) return "Heavy"; // 20%
    return "Standstill"; // 80%
  }
  return baseLevel;
};

const getZoneSpecificAdjustment = (zoneName: string, baseLevel: TrafficLevel, hour: number): TrafficLevel => {
  let adjustedLevel = baseLevel;
  // Example: Tangente is almost always heavy or standstill during day
  if (zoneName.includes("Tangente") && hour >= 6 && hour < 20) {
    if (baseLevel === "Light" || baseLevel === "Moderate") adjustedLevel = "Heavy";
    if (baseLevel === "Heavy" && Math.random() < 0.5) adjustedLevel = "Standstill";
  }
  // Example: Inner districts are calmer late evening
  if (zoneName.includes("Inner Districts") && hour >= 20 && hour < 23) {
     if (baseLevel === "Heavy") adjustedLevel = "Moderate";
     if (baseLevel === "Moderate") adjustedLevel = "Light";
  }
  return adjustedLevel;
};


export default function TrafficSimulationPage() {
  const [simulatedTime, setSimulatedTime] = useState(() => {
    const now = new Date();
    now.setHours(8, 0, 0, 0); // Start at 8:00 AM
    return now;
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(10); // 1 tick = 10 simulated minutes
  const [trafficZones, setTrafficZones] = useState<TrafficZone[]>(
    ZONES_IN_VIENNA.map(zone => ({...zone, currentLevel: "Light"}))
  );

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const updateTrafficState = useCallback((currentTime: Date) => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const day = currentTime.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const newZoneStates = ZONES_IN_VIENNA.map(zone => {
      let baseSystemLevel = getBaseTrafficLevel(hour, minute, day);
      let zoneAdjustedLevel = getZoneSpecificAdjustment(zone.name, baseSystemLevel, hour);
      let finalLevel = getRandomizedLevel(zoneAdjustedLevel);
      return { ...zone, currentLevel: finalLevel };
    });
    setTrafficZones(newZoneStates);
  }, []);

  useEffect(() => {
    if (isSimulating) {
      simulationIntervalRef.current = setInterval(() => {
        setSimulatedTime((prevTime) => {
          const newTime = addMinutes(prevTime, simulationSpeed);
          updateTrafficState(newTime);
          return newTime;
        });
      }, 1000); // Update every 1 real second
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isSimulating, simulationSpeed, updateTrafficState]);

  // Initial traffic state update
  useEffect(() => {
    updateTrafficState(simulatedTime);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleTimeChange = (newTime: string) => {
    const [hours, minutes] = newTime.split(':').map(Number);
    setSimulatedTime(prev => {
      const newDate = new Date(prev);
      newDate.setHours(hours, minutes, 0, 0);
      if (!isSimulating) updateTrafficState(newDate); // Update immediately if not simulating
      return newDate;
    });
  };
  
  const handleResetDemo = () => {
    setIsSimulating(false);
    const initialSimTime = new Date();
    initialSimTime.setHours(8,0,0,0);
    setSimulatedTime(initialSimTime);
    setSimulationSpeed(10);
    updateTrafficState(initialSimTime);
    toast({ title: "Traffic Simulation Reset", description: "Simulation reset to default state." });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TrafficSimHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <TrafficControlsCard
              simulatedTime={format(simulatedTime, 'HH:mm')}
              onTimeChange={handleTimeChange}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
              simulationSpeed={simulationSpeed}
              onSimulationSpeedChange={setSimulationSpeed}
            />
          </div>
          <div className="lg:col-span-2">
            <SimulationViewCard
              simulatedTime={simulatedTime}
              trafficZones={trafficZones}
            />
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleResetDemo}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Simulation
          </Button>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Vienna Traffic Simulator. For demonstration purposes.</p>
      </footer>
    </div>
  );
}
