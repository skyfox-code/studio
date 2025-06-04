"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FuzzyStatHeader } from '@/components/FuzzyStat/Header';
import { CurrentReadingsCard } from '@/components/FuzzyStat/CurrentReadingsCard';
import { TemperatureControlCard } from '@/components/FuzzyStat/TemperatureControlCard';
import { OutputVisualizationCard } from '@/components/FuzzyStat/OutputVisualizationCard';
import { ScheduleCard } from '@/components/FuzzyStat/ScheduleCard/ScheduleCard';
import type { ScheduleEntry } from '@/components/FuzzyStat/ScheduleCard/types';
import { regulateTemperature } from '@/ai/flows/fuzzy-logic-thermostat';
import { fuzzyOutputExplanation } from '@/ai/flows/fuzzy-output-explanation';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function FuzzyStatPage() {
  const [currentTemperature, setCurrentTemperature] = useState(22);
  const [currentHumidity, setCurrentHumidity] = useState(45);
  const [desiredTemperature, setDesiredTemperature] = useState(20);
  
  const [heatingOutput, setHeatingOutput] = useState(0);
  const [coolingOutput, setCoolingOutput] = useState(0);
  const [fuzzyExplanation, setFuzzyExplanation] = useState<string | null>(null);
  
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const { toast } = useToast();
  const desiredTemperatureRef = useRef(desiredTemperature); // For interval closure

  useEffect(() => {
    desiredTemperatureRef.current = desiredTemperature;
  }, [desiredTemperature]);

  const fetchFuzzyLogicOutput = useCallback(async (temp: number, humidity: number, targetTemp: number) => {
    setIsLoadingAi(true);
    setFuzzyExplanation(null); // Clear previous explanation
    try {
      const regulation = await regulateTemperature({
        currentTemperature: temp,
        currentHumidity: humidity,
        targetTemperature: targetTemp,
      });
      setHeatingOutput(regulation.heatingOutput);
      setCoolingOutput(regulation.coolingOutput);

      const explanationResult = await fuzzyOutputExplanation({
        currentTemperature: temp,
        currentHumidity: humidity,
        desiredTemperature: targetTemp,
        heatingOutput: regulation.heatingOutput,
        coolingOutput: regulation.coolingOutput,
      });
      setFuzzyExplanation(explanationResult.explanation);

    } catch (error) {
      console.error("Error with Fuzzy Logic AI:", error);
      toast({
        title: "AI Error",
        description: "Could not get fuzzy logic output. Please try again.",
        variant: "destructive",
      });
      setHeatingOutput(0); // Reset on error
      setCoolingOutput(0);
      setFuzzyExplanation("Failed to load explanation.");
    } finally {
      setIsLoadingAi(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFuzzyLogicOutput(currentTemperature, currentHumidity, desiredTemperature);
  }, [currentTemperature, currentHumidity, desiredTemperature, fetchFuzzyLogicOutput]);

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
      
      // If no entry matched for today, check if there's a "latest" entry from "yesterday" (last entry of the day)
      if (!activeEntry && sortedSchedule.length > 0) {
          // This logic could be refined for schedules spanning midnight.
          // For simplicity, if current time is before the first schedule, use the last schedule of the day.
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

    applySchedule(); // Initial check
    const intervalId = setInterval(applySchedule, 60000); // Check every minute

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

  // Simulate sensor changes for demo
  const resetDemoValues = () => {
    setCurrentTemperature(22);
    setCurrentHumidity(45);
    setDesiredTemperature(20);
    setSchedule([]); // Clears schedule too, or keep it? Let's clear for full reset.
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
            disabled={isLoadingAi}
          />
          <OutputVisualizationCard
            heatingOutput={heatingOutput}
            coolingOutput={coolingOutput}
            explanation={fuzzyExplanation}
            isLoading={isLoadingAi}
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
        <p>&copy; {new Date().getFullYear()} FuzzyStat. Powered by GenAI.</p>
      </footer>
    </div>
  );
}
