import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Medication } from "@/types/medication";
import { X } from "lucide-react";

interface Props {
  onSave: (name: string, time: string, dose: string) => void;
  onUpdate?: (id: string, data: { name: string; time: string; dose: string }) => void;
  editingMed?: Medication | null;
  onClose: () => void;
}

export default function MedicationForm({ onSave, onUpdate, editingMed, onClose }: Props) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [dose, setDose] = useState("");

  useEffect(() => {
    if (editingMed) {
      setName(editingMed.name);
      setTime(editingMed.time);
      setDose(editingMed.dose);
    } else {
      setName("");
      setTime("");
      setDose("");
    }
  }, [editingMed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !time || !dose.trim()) return;
    if (editingMed && onUpdate) {
      onUpdate(editingMed.id, { name: name.trim(), time, dose: dose.trim() });
    } else {
      onSave(name.trim(), time, dose.trim());
    }
    setName("");
    setTime("");
    setDose("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">
            {editingMed ? "Editar Medicamento" : "Novo Medicamento"}
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="med-name" className="text-base sm:text-lg font-semibold">
            Nome do Medicamento
          </Label>
          <Input
            id="med-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Losartana"
            className="h-12 text-base sm:h-14 sm:text-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="med-time" className="text-base sm:text-lg font-semibold">
            Horário
          </Label>
          <Input
            id="med-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-12 text-base sm:h-14 sm:text-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="med-dose" className="text-base sm:text-lg font-semibold">
            Dose
          </Label>
          <Input
            id="med-dose"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="Ex: 1 comprimido"
            className="h-12 text-base sm:h-14 sm:text-lg"
            required
          />
        </div>

        <Button type="submit" size="xl" className="w-full h-12 sm:h-16 text-base sm:text-xl">
          {editingMed ? "Salvar Alterações" : "Adicionar Medicamento"}
        </Button>
      </form>
    </div>
  );
}

