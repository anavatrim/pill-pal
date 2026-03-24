import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationStatus } from "@/types/medication";

const STORAGE_KEY = "medications";

function loadMedications(): Medication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const meds: Medication[] = JSON.parse(data);
    // Reset statuses daily
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("medications_date");
    if (lastDate !== today) {
      localStorage.setItem("medications_date", today);
      return meds.map((m) => ({ ...m, status: "pending" as MedicationStatus, snoozedUntil: undefined }));
    }
    return meds;
  } catch {
    return [];
  }
}

function saveMedications(meds: Medication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
  localStorage.setItem("medications_date", new Date().toDateString());
}

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>(loadMedications);

  useEffect(() => {
    saveMedications(medications);
  }, [medications]);

  const addMedication = useCallback((name: string, time: string, dose: string) => {
    const med: Medication = {
      id: crypto.randomUUID(),
      name,
      time,
      dose,
      status: "pending",
      createdAt: Date.now(),
    };
    setMedications((prev) => [...prev, med].sort((a, b) => a.time.localeCompare(b.time)));
  }, []);

  const updateMedication = useCallback((id: string, data: Partial<Pick<Medication, "name" | "time" | "dose">>) => {
    setMedications((prev) =>
      prev
        .map((m) => (m.id === id ? { ...m, ...data } : m))
        .sort((a, b) => a.time.localeCompare(b.time))
    );
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const markAsTaken = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "taken" as MedicationStatus, snoozedUntil: undefined } : m))
    );
  }, []);

  const snoozeMedication = useCallback((id: string, minutes = 5) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, snoozedUntil: Date.now() + minutes * 60 * 1000 }
          : m
      )
    );
  }, []);

  const markAsLate = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "late" as MedicationStatus } : m))
    );
  }, []);

  return { medications, addMedication, updateMedication, deleteMedication, markAsTaken, snoozeMedication, markAsLate };
}
