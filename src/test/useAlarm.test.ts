import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAlarm } from "@/hooks/useAlarm";
import { Medication } from "@/types/medication";

class MockNotification {
  static permission = "granted";
  static requestPermission = vi.fn().mockResolvedValue("granted");
  title: string;
  options?: any;
  constructor(title: string, options?: any) {
    this.title = title;
    this.options = options;
  }
}

describe("useAlarm Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock AudioContext
    const mockOscillator = {
      connect: vi.fn(),
      frequency: { value: 0 },
      type: "square",
      start: vi.fn(),
      stop: vi.fn(),
    };
    const mockGain = {
      connect: vi.fn(),
      gain: { value: 0 },
    };
    const mockAudioCtx = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGain),
      destination: {},
      close: vi.fn(),
    };
    vi.stubGlobal("AudioContext", vi.fn(() => mockAudioCtx));

    // Mock Notification as a class constructor
    vi.stubGlobal("Notification", MockNotification);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("deve inicializar com nenhum alerta ativo", () => {
    const onMarkLate = vi.fn();
    const { result } = renderHook(() => useAlarm([], onMarkLate));

    expect(result.current.alertMed).toBeNull();
  });

  it("não deve disparar alerta para medicamentos com status 'taken'", () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const medTomado: Medication = {
      id: "med-1",
      name: "Medicamento Já Tomado",
      time: `${hh}:${mm}`,
      dose: "1 comprimido",
      status: "taken",
      createdAt: Date.now(),
    };

    const onMarkLate = vi.fn();
    const { result } = renderHook(() => useAlarm([medTomado], onMarkLate));

    act(() => {
      vi.advanceTimersByTime(11000); // 11 segundos
    });

    expect(result.current.alertMed).toBeNull();
    expect(onMarkLate).not.toHaveBeenCalled();
  });

  it("deve disparar alerta quando o horário do medicamento pending coincide com o horário atual", () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const medPendente: Medication = {
      id: "med-2",
      name: "Medicamento da Hora",
      time: `${hh}:${mm}`,
      dose: "500mg",
      status: "pending",
      createdAt: Date.now(),
    };

    const onMarkLate = vi.fn();
    const { result } = renderHook(() => useAlarm([medPendente], onMarkLate));

    act(() => {
      vi.advanceTimersByTime(11000); // Avança o intervalo de 10s
    });

    expect(result.current.alertMed).not.toBeNull();
    expect(result.current.alertMed?.id).toBe("med-2");
    expect(result.current.alertMed?.name).toBe("Medicamento da Hora");
  });

  it("deve dispensar o alerta ao chamar dismissAlert", () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const medPendente: Medication = {
      id: "med-3",
      name: "Medicamento para Dispensar",
      time: `${hh}:${mm}`,
      dose: "10ml",
      status: "pending",
      createdAt: Date.now(),
    };

    const onMarkLate = vi.fn();
    const { result } = renderHook(() => useAlarm([medPendente], onMarkLate));

    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(result.current.alertMed).not.toBeNull();

    act(() => {
      result.current.dismissAlert();
    });

    expect(result.current.alertMed).toBeNull();
  });

  it("não deve disparar alerta se o medicamento estiver com adiamento ativo (snooze)", () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    const medAdiado: Medication = {
      id: "med-4",
      name: "Medicamento Adiado",
      time: `${hh}:${mm}`,
      dose: "1 cp",
      status: "pending",
      snoozedUntil: Date.now() + 15 * 60 * 1000, // Adiado para +15 minutos
      createdAt: Date.now(),
    };

    const onMarkLate = vi.fn();
    const { result } = renderHook(() => useAlarm([medAdiado], onMarkLate));

    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(result.current.alertMed).toBeNull();
  });
});
