
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sun, Snowflake } from "lucide-react";

interface OutputVisualizationCardProps {
  heatingOutput: number; // 0-100
  coolingOutput: number; // 0-100
  reasoning: string | null;
}

export function OutputVisualizationCard({
  heatingOutput,
  coolingOutput,
  reasoning,
}: OutputVisualizationCardProps) {
  const statusText =
    heatingOutput > 0
    ? `Heating: ${heatingOutput.toFixed(0)}%`
    : coolingOutput > 0
    ? `Cooling: ${coolingOutput.toFixed(0)}%`
    : "Idle - Maintaining Temperature";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">System Output</CardTitle>
        {reasoning && (
           <CardDescription className="pt-2 text-sm">{reasoning}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sun className={`h-6 w-6 ${heatingOutput > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-lg">Heating</span>
            </div>
            <span className={`text-xl font-semibold ${heatingOutput > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {`${heatingOutput.toFixed(0)}%`}
            </span>
          </div>
          <Progress value={heatingOutput} aria-label="Heating output" className="h-3 [&>div]:bg-destructive" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Snowflake className={`h-6 w-6 ${coolingOutput > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-lg">Cooling</span>
            </div>
            <span className={`text-xl font-semibold ${coolingOutput > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              {`${coolingOutput.toFixed(0)}%`}
            </span>
          </div>
          <Progress value={coolingOutput} aria-label="Cooling output" className="h-3 [&>div]:bg-primary" />
        </div>
        
        <div className="text-center text-muted-foreground pt-2">
          <p className="text-sm font-medium">{statusText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
