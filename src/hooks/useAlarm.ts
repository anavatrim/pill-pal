import { useEffect, useRef, useState, useCallback } from "react";
import { Medication } from "@/types/medication";

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function useAlarm(
  medications: Medication[],
  onMarkLate: (id: string) => void
) {
  const [alertMed, setAlertMed] = useState<Medication | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertStartRef = useRef<number>(0);

  // Create audio context for alarm sound
  const playAlarm = useCallback(() => {
    try {
      if (!audioRef.current) {
        // Use AudioContext to generate alarm beep
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = "square";
        gain.gain.value = 0.3;
        oscillator.start();
        // Store for cleanup
        (audioRef as any)._ctx = ctx;
        (audioRef as any)._osc = oscillator;
      }
      // Vibrate
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    } catch (e) {
      console.log("Audio not available", e);
    }
  }, []);

  const stopAlarm = useCallback(() => {
    try {
      const osc = (audioRef as any)?._osc;
      const ctx = (audioRef as any)?._ctx;
      if (osc) osc.stop();
      if (ctx) ctx.close();
      (audioRef as any)._osc = null;
      (audioRef as any)._ctx = null;
      audioRef.current = null;
    } catch {}
  }, []);

  const dismissAlert = useCallback(() => {
    stopAlarm();
    setAlertMed(null);
  }, [stopAlarm]);

  // Check every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (alertMed) {
        // If alert has been showing for > 10 minutes, mark as late
        if (Date.now() - alertStartRef.current > 10 * 60 * 1000) {
          onMarkLate(alertMed.id);
          dismissAlert();
        }
        return;
      }

      const now = nowMinutes();
      for (const med of medications) {
        if (med.status !== "pending") continue;
        const medMin = timeToMinutes(med.time);

        // Check if snoozed
        if (med.snoozedUntil && Date.now() < med.snoozedUntil) continue;

        // If it's time (within 1 min window) or snoozed and time is up
        if (now >= medMin && now <= medMin + 30) {
          setAlertMed(med);
          alertStartRef.current = Date.now();
          playAlarm();

          // Browser notification
          if (Notification.permission === "granted") {
            new Notification(`💊 Hora do medicamento!`, {
              body: `${med.name} - ${med.dose}`,
              requireInteraction: true,
            });
          }
          break;
        }

        // If more than 30 min late, mark as late
        if (now > medMin + 30 && !med.snoozedUntil) {
          onMarkLate(med.id);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [medications, alertMed, playAlarm, onMarkLate, dismissAlert]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return { alertMed, dismissAlert, stopAlarm };
}
