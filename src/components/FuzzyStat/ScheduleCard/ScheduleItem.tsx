"use client";

import { Button } from "@/components/ui/button";
import { Clock, Edit3, Thermometer, Trash2 } from "lucide-react";
import type { ScheduleEntry } from "./types";

interface ScheduleItemProps {
  entry: ScheduleEntry;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (id: string) => void;
}

export function ScheduleItem({ entry, onEdit, onDelete }: ScheduleItemProps) {
  return (
    <li className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-secondary/50 transition-colors rounded-md">
      <div className="flex-1 space-y-1">
        <p className="font-semibold text-base">{entry.name}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {entry.time}</span>
          <span className="flex items-center"><Thermometer className="h-4 w-4 mr-1" /> {entry.temperature.toFixed(1)}°C</span>
        </div>
      </div>
      <div className="space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} aria-label="Edit schedule">
          <Edit3 className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)} aria-label="Delete schedule">
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </li>
  );
}
