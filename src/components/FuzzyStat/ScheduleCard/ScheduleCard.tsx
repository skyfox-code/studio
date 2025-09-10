"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScheduleForm } from "./ScheduleForm";
import { ScheduleItem } from "./ScheduleItem";
import type { ScheduleEntry } from "./types";

interface ScheduleCardProps {
  schedule: ScheduleEntry[];
  onAddSchedule: (data: Omit<ScheduleEntry, "id">) => void;
  onUpdateSchedule: (data: ScheduleEntry) => void;
  onDeleteSchedule: (id: string) => void;
}

export function ScheduleCard({
  schedule,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
}: ScheduleCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | undefined>(undefined);

  const handleOpenDialog = (entry?: ScheduleEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingEntry(undefined);
    setIsDialogOpen(false);
  };

  const handleSubmitForm = (data: Omit<ScheduleEntry, "id">) => {
    if (editingEntry) {
      onUpdateSchedule({ ...editingEntry, ...data });
    } else {
      onAddSchedule(data);
    }
    handleCloseDialog();
  };

  const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline flex items-center">
            <CalendarDays className="h-6 w-6 mr-2 text-primary" />
            Temperature Schedule
          </CardTitle>
          <CardDescription>Automate temperature adjustments throughout the day.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} variant="brand">
          <PlusCircle className="mr-2 h-5 w-5" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {sortedSchedule.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No schedules set. Add one to get started!</p>
        ) : (
          <ul className="space-y-2">
            {sortedSchedule.map((entry) => (
              <ScheduleItem
                key={entry.id}
                entry={entry}
                onEdit={() => handleOpenDialog(entry)}
                onDelete={onDeleteSchedule}
              />
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingEntry ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
            <DialogDescription>
              {editingEntry ? "Update the details for your schedule." : "Set a time and temperature for automatic adjustment."}
            </DialogDescription>
          </DialogHeader>
          <ScheduleForm
            onSubmit={handleSubmitForm}
            onCancel={handleCloseDialog}
            defaultValues={editingEntry}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
