import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMedications } from "@/hooks/useMedications";

describe("useMedications Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("deve inicializar com lista vazia de medicamentos", () => {
    const { result } = renderHook(() => useMedications());
    expect(result.current.medications).toEqual([]);
  });

  it("deve adicionar um novo medicamento e persistir no estado", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Amoxicilina", "08:00", "500mg");
    });

    expect(result.current.medications).toHaveLength(1);
    expect(result.current.medications[0].name).toBe("Amoxicilina");
    expect(result.current.medications[0].time).toBe("08:00");
    expect(result.current.medications[0].dose).toBe("500mg");
    expect(result.current.medications[0].status).toBe("pending");
    expect(result.current.medications[0].id).toBeDefined();
  });

  it("deve ordenar medicamentos automaticamente em ordem cronológica", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Remédio Noite", "22:00", "1 cp");
    });
    act(() => {
      result.current.addMedication("Remédio Manhã", "07:30", "1 cp");
    });
    act(() => {
      result.current.addMedication("Remédio Tarde", "14:00", "1 cp");
    });

    const times = result.current.medications.map((m) => m.time);
    expect(times).toEqual(["07:30", "14:00", "22:00"]);
  });

  it("deve atualizar os dados de um medicamento existente", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Dipirona", "12:00", "1g");
    });

    const id = result.current.medications[0].id;

    act(() => {
      result.current.updateMedication(id, { dose: "500mg", time: "13:00" });
    });

    expect(result.current.medications[0].dose).toBe("500mg");
    expect(result.current.medications[0].time).toBe("13:00");
    expect(result.current.medications[0].name).toBe("Dipirona");
  });

  it("deve excluir um medicamento corretamente", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Paracetamol", "09:00", "750mg");
    });

    const id = result.current.medications[0].id;

    act(() => {
      result.current.deleteMedication(id);
    });

    expect(result.current.medications).toHaveLength(0);
  });

  it("deve marcar o medicamento como tomado (taken)", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Vitamina C", "10:00", "1g");
    });

    const id = result.current.medications[0].id;

    act(() => {
      result.current.markAsTaken(id);
    });

    expect(result.current.medications[0].status).toBe("taken");
  });

  it("deve adiar o medicamento (snoozeMedication) com timestamp futuro", () => {
    const { result } = renderHook(() => useMedications());
    const agora = Date.now();

    act(() => {
      result.current.addMedication("Omeprazol", "06:30", "20mg");
    });

    const id = result.current.medications[0].id;

    act(() => {
      result.current.snoozeMedication(id, 10); // 10 minutos
    });

    expect(result.current.medications[0].status).toBe("pending");
    expect(result.current.medications[0].snoozedUntil).toBeGreaterThanOrEqual(
      agora + 10 * 60 * 1000 - 100
    );
  });

  it("deve marcar o medicamento como atrasado (late)", () => {
    const { result } = renderHook(() => useMedications());

    act(() => {
      result.current.addMedication("Losartana", "07:00", "50mg");
    });

    const id = result.current.medications[0].id;

    act(() => {
      result.current.markAsLate(id);
    });

    expect(result.current.medications[0].status).toBe("late");
  });
});
