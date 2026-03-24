import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationStatus } from "@/types/medication";

const MEDS_KEY = "medications";
const STATUS_KEY = "medications_status";

/** Load the base medication list (persists forever until deleted) */
function loadMeds(): Medication[] {
  try {
    return JSON.parse(localStorage.getItem(MEDS_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Load today's statuses. Resets every new day so meds repeat daily. */
function loadTodayStatus(): Record<string, { status: MedicationStatus; snoozedUntil?: number }> {
  try {
    const data = JSON.parse(localStorage.getItem(STATUS_KEY) || "{}");
    if (data._date === new Date().toDateString()) return data;
    return { _date: new Date().toDateString() };
  } catch {
    return { _date: new Date().toDateString() };
  }
}

function saveMeds(meds: Medication[]) {
  localStorage.setItem(MEDS_KEY, JSON.stringify(meds));
}

function saveStatus(s: Record<string, any>) {
  localStorage.setItem(STATUS_KEY, JSON.stringify({ ...s, _date: new Date().toDateString() }));
}

export function useMedications() {
  const [baseMeds, setBaseMeds] = useState<Medication[]>(loadMeds);
  const [todayStatus, setTodayStatus] = useState<Record<string, any>>(loadTodayStatus);

  useEffect(() => saveMeds(baseMeds), [baseMeds]);
  useEffect(() => saveStatus(todayStatus), [todayStatus]);

  // Merge base meds with today's status
  const medications: Medication[] = baseMeds
    .map((m) => ({
      ...m,
      status: (todayStatus[m.id]?.status as MedicationStatus) || "pending",
      snoozedUntil: todayStatus[m.id]?.snoozedUntil,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const addMedication = useCallback((name: string, time: string, dose: string) => {
    const med: Medication = {
      id: crypto.randomUUID(),
      name,
      time,
      dose,
      status: "pending",
      createdAt: Date.now(),
    };
    setBaseMeds((prev) => [...prev, med]);
  }, []);

  const updateMedication = useCallback((id: string, data: Partial<Pick<Medication, "name" | "time" | "dose">>) => {
    setBaseMeds((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setBaseMeds((prev) => prev.filter((m) => m.id !== id));
    setTodayStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const markAsTaken = useCallback((id: string) => {
    setTodayStatus((prev) => ({ ...prev, [id]: { status: "taken" } }));
  }, []);

  const snoozeMedication = useCallback((id: string, minutes = 5) => {
    setTodayStatus((prev) => ({
      ...prev,
      [id]: { status: "pending", snoozedUntil: Date.now() + minutes * 60 * 1000 },
    }));
  }, []);

  const markAsLate = useCallback((id: string) => {
    setTodayStatus((prev) => ({ ...prev, [id]: { status: "late" } }));
  }, []);

  return { medications, addMedication, updateMedication, deleteMedication, markAsTaken, snoozeMedication, markAsLate };
}
