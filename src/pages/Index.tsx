import { useState } from "react";
import { useMedications } from "@/hooks/useMedications";
import { useAlarm } from "@/hooks/useAlarm";
import MedicationList from "@/components/MedicationList";
import MedicationForm from "@/components/MedicationForm";
import AlarmAlert from "@/components/AlarmAlert";
import { Button } from "@/components/ui/button";
import { Plus, Pill } from "lucide-react";
import { Medication } from "@/types/medication";

export default function Index() {
  const {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsTaken,
    snoozeMedication,
    markAsLate,
  } = useMedications();

  const { alertMed, dismissAlert, stopAlarm } = useAlarm(medications, markAsLate);
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const handleTaken = (id: string) => {
    markAsTaken(id);
    stopAlarm();
    dismissAlert();
  };

  const handleSnooze = (id: string) => {
    snoozeMedication(id, 5);
    stopAlarm();
    dismissAlert();
  };

  const handleEdit = (med: Medication) => {
    setEditingMed(med);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja excluir este medicamento?")) {
      deleteMedication(id);
    }
  };

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const takenCount = medications.filter((m) => m.status === "taken").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-5 pt-10 pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Pill className="w-8 h-8" />
            <h1 className="text-2xl font-extrabold">Meus Remédios</h1>
          </div>
          <p className="text-base opacity-90 capitalize">{today}</p>
          {medications.length > 0 && (
            <div className="mt-3 bg-primary-foreground/15 rounded-xl px-4 py-2 inline-block">
              <span className="text-lg font-bold">
                {takenCount}/{medications.length} tomados
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28">
        <MedicationList
          medications={medications}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="xl"
          onClick={() => {
            setEditingMed(null);
            setShowForm(true);
          }}
          className="rounded-full shadow-xl h-16 w-16 p-0"
          aria-label="Adicionar medicamento"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <MedicationForm
          onSave={addMedication}
          onUpdate={updateMedication}
          editingMed={editingMed}
          onClose={() => {
            setShowForm(false);
            setEditingMed(null);
          }}
        />
      )}

      {/* Alarm Alert */}
      {alertMed && (
        <AlarmAlert
          medication={alertMed}
          onTaken={handleTaken}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  );
}
