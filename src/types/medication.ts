export type MedicationStatus = "pending" | "taken" | "late";

export interface Medication {
  id: string;
  name: string;
  time: string; // HH:mm
  dose: string;
  status: MedicationStatus;
  snoozedUntil?: number; // timestamp
  createdAt: number;
}
