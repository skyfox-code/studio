
"use client";

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock as ClockIcon } from "lucide-react";
import { format } from 'date-fns';

export const ClockCard: FC = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client-side mount to avoid hydration mismatch
    setCurrentTime(new Date()); 
    
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this runs once on mount for setup

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold font-headline">
          Live Clock
        </CardTitle>
        <ClockIcon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent className="text-center">
        {currentTime ? (
          <>
            <div className="text-5xl font-bold text-accent pt-2 pb-1">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-sm text-muted-foreground pb-2">
              {format(currentTime, 'eeee, MMMM do, yyyy')}
            </div>
          </>
        ) : (
          // Placeholder for initial render before client-side effect runs
          <>
            <div className="text-5xl font-bold text-accent pt-2 pb-1">
              --:--:--
            </div>
            <div className="text-sm text-muted-foreground pb-2">
              Loading date...
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
