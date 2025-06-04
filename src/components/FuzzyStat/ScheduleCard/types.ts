export interface ScheduleEntry {
  id: string;
  name: string;
  time: string; // HH:mm format, e.g., "08:00"
  temperature: number;
}
