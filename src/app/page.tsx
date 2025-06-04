
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FuzzyStatHeader } from '@/components/FuzzyStat/Header';
import { CurrentReadingsCard } from '@/components/FuzzyStat/CurrentReadingsCard';
import { TemperatureControlCard } from '@/components/FuzzyStat/TemperatureControlCard';
import { OutputVisualizationCard } from '@/components/FuzzyStat/OutputVisualizationCard';
import { ScheduleCard } from '@/components/FuzzyStat/ScheduleCard/ScheduleCard';
import type { ScheduleEntry } from '@/components/FuzzyStat/ScheduleCard/types';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function FuzzyStatPage() {
  const [currentTemperature, setCurrentTemperature] = useState(22);
  const [currentHumidity, setCurrentHumidity] = useState(45);
  const [desiredTemperature, setDesiredTemperature] = useState(20);
  
  const [heatingOutput, setHeatingOutput] = useState(0);
  const [coolingOutput, setCoolingOutput] = useState(0);
  const [systemReasoning, setSystemReasoning] = useState<string | null>(null);
  
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  const { toast } = useToast();
  const desiredTemperatureRef = useRef(desiredTemperature); 

  useEffect(() => {
    desiredTemperatureRef.current = desiredTemperature;
  }, [desiredTemperature]);

  const calculateSystemOutput = useCallback((temp: number, humidity: number, targetTemp: number) => {
    let perceivedTemp = temp;
    let humidityEffectReasoning = "";

    if (humidity > 60) {
      const adjustment = (humidity - 60) * 0.05; // Each 1% over 60% feels 0.05C warmer
      perceivedTemp -= adjustment;
      humidityEffectReasoning = ` (feels like ${perceivedTemp.toFixed(1)}°C due to high humidity of ${humidity}%)`;
    } else if (humidity < 40) {
      const adjustment = (40 - humidity) * 0.05; // Each 1% under 40% feels 0.05C cooler
      perceivedTemp += adjustment;
      humidityEffectReasoning = ` (feels like ${perceivedTemp.toFixed(1)}°C due to low humidity of ${humidity}%)`;
    }

    const tempDiff = targetTemp - perceivedTemp; // Positive if too cold, negative if too hot
    let newHeatingOutput = 0;
    let newCoolingOutput = 0;
    let newReasoning = "";

    // Define a deadband of +/- 0.5C around the target
    const deadband = 0.5;

    if (tempDiff > deadband) { // Need to heat
      newHeatingOutput = Math.min(100, Math.max(0, (tempDiff - deadband) * 25)); // Proportional heating, 4C effective diff for 100%
      newCoolingOutput = 0;
      newReasoning = `Heating: Current temperature ${temp.toFixed(1)}°C${humidityEffectReasoning} is below the target of ${targetTemp.toFixed(1)}°C.`;
    } else if (tempDiff < -deadband) { // Need to cool
      newHeatingOutput = 0;
      newCoolingOutput = Math.min(100, Math.max(0, (Math.abs(tempDiff) - deadband) * 25)); // Proportional cooling
      newReasoning = `Cooling: Current temperature ${temp.toFixed(1)}°C${humidityEffectReasoning} is above the target of ${targetTemp.toFixed(1)}°C.`;
    } else { // Within deadband, idle
      newHeatingOutput = 0;
      newCoolingOutput = 0;
      newReasoning = `Idle: Current temperature ${temp.toFixed(1)}°C${humidityEffectReasoning} is close to the target of ${targetTemp.toFixed(1)}°C.`;
    }

    setHeatingOutput(newHeatingOutput);
    setCoolingOutput(newCoolingOutput);
    setSystemReasoning(newReasoning);
  }, []); // Removed dependencies on setHeatingOutput, setCoolingOutput, setSystemReasoning as they are stable

  useEffect(() => {
    calculateSystemOutput(currentTemperature, currentHumidity, desiredTemperature);
  }, [currentTemperature, currentHumidity, desiredTemperature, calculateSystemOutput]);

  // Schedule application logic
  useEffect(() => {
    const applySchedule = () => {
      if (schedule.length === 0) return;
      
      const now = new Date();
      const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      let activeEntry: ScheduleEntry | null = null;
      const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

      for (const entry of sortedSchedule) {
        if (currentTimeString >= entry.time) {
          activeEntry = entry;
        } else {
          break; 
        }
      }
      
      if (!activeEntry && sortedSchedule.length > 0) {
          const firstScheduleTime = sortedSchedule[0].time;
          if (currentTimeString < firstScheduleTime) {
              activeEntry = sortedSchedule[sortedSchedule.length -1];
          }
      }

      if (activeEntry && activeEntry.temperature !== desiredTemperatureRef.current) {
        setDesiredTemperature(activeEntry.temperature);
        toast({
          title: "Schedule Applied",
          description: `Temperature set to ${activeEntry.temperature}°C by '${activeEntry.name}' schedule.`,
        });
      }
    };

    applySchedule(); 
    const intervalId = setInterval(applySchedule, 60000); 

    return () => clearInterval(intervalId);
  }, [schedule, toast]);


  const handleAddSchedule = (data: Omit<ScheduleEntry, "id">) => {
    const newEntry: ScheduleEntry = { ...data, id: crypto.randomUUID() };
    setSchedule((prev) => [...prev, newEntry]);
    toast({ title: "Schedule Added", description: `'${newEntry.name}' schedule created.`});
  };

  const handleUpdateSchedule = (updatedEntry: ScheduleEntry) => {
    setSchedule((prev) => prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)));
    toast({ title: "Schedule Updated", description: `'${updatedEntry.name}' schedule modified.`});
  };

  const handleDeleteSchedule = (id: string) => {
    const entryToDelete = schedule.find(s => s.id === id);
    setSchedule((prev) => prev.filter((e) => e.id !== id));
    if (entryToDelete) {
      toast({ title: "Schedule Deleted", description: `'${entryToDelete.name}' schedule removed.`, variant: "destructive" });
    }
  };

  const resetDemoValues = () => {
    setCurrentTemperature(22);
    setCurrentHumidity(45);
    setDesiredTemperature(20);
    setSchedule([]); 
    toast({ title: "Demo Reset", description: "All values reset to defaults." });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <FuzzyStatHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6 lg:space-y-8">
            <CurrentReadingsCard temperature={currentTemperature} humidity={currentHumidity} />
             <div className="flex space-x-2 justify-center">
                <Button onClick={() => setCurrentTemperature(t => t + 0.5)}>Temp +</Button>
                <Button onClick={() => setCurrentTemperature(t => t - 0.5)}>Temp -</Button>
                <Button onClick={() => setCurrentHumidity(h => Math.min(100, h + 5))}>Hum +</Button>
                <Button onClick={() => setCurrentHumidity(h => Math.max(0, h - 5))}>Hum -</Button>
            </div>
          </div>
          <TemperatureControlCard
            desiredTemperature={desiredTemperature}
            onDesiredTemperatureChange={setDesiredTemperature}
          />
          <OutputVisualizationCard
            heatingOutput={heatingOutput}
            coolingOutput={coolingOutput}
            reasoning={systemReasoning}
          />
          <ScheduleCard
            schedule={schedule}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        </div>
         <div className="mt-8 text-center">
            <Button variant="outline" onClick={resetDemoValues}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Demo
            </Button>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FuzzyStat. Logic by Rules.</p>
      </footer>
    </div>
  );
}
