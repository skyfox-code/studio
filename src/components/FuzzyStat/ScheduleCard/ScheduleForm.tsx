"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { ScheduleEntry } from "./types";

const scheduleFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).max(50, { message: "Name must be 50 characters or less." }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format. Use HH:MM." }),
  temperature: z.number().min(10).max(30),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<ScheduleEntry>;
}

export function ScheduleForm({ onSubmit, onCancel, defaultValues }: ScheduleFormProps) {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      time: defaultValues?.time || "08:00",
      temperature: defaultValues?.temperature || 20,
    },
  });

  const currentTemperature = form.watch("temperature");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning, Evening" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time (HH:MM)</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature: {currentTemperature.toFixed(1)}°C</FormLabel>
              <FormControl>
                 <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={10}
                    max={30}
                    step={0.5}
                  />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10°C</span>
                <span>30°C</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Schedule</Button>
        </div>
      </form>
    </Form>
  );
}
