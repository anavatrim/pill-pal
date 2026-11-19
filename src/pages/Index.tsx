import { useState } from "react";
import { useMedications } from "@/hooks/useMedications";
import { useAlarm } from "@/hooks/useAlarm";
import WelcomeScreen from "@/components/WelcomeScreen";
import MedicationCards from "@/components/MedicationCards";
import MedicationForm from "@/components/MedicationForm";
import AlarmAlert from "@/components/AlarmAlert";
import { Button } from "@/components/ui/button";
import { Plus, Pill } from "lucide-react";
import { Medication } from "@/types/medication";

export default function Index() {
  const [userName, setUserName] = useState<string | null>(
    () => localStorage.getItem("user_name")
  );

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

  // Show welcome screen if no name saved
  if (!userName) {
    return <WelcomeScreen onComplete={setUserName} />;
  }

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
      <header className="bg-primary text-primary-foreground px-4 pt-8 pb-5 sm:px-5 sm:pt-10 sm:pb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-1">
            <Pill className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-sm sm:text-base font-semibold opacity-80">Meus Remédios</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Olá, {userName} 👋</h1>
          <p className="text-sm sm:text-base opacity-80 capitalize mt-1">{today}</p>
          {medications.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-primary-foreground/15 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg font-bold">
                {takenCount}/{medications.length} tomados
              </span>
              {takenCount === medications.length && medications.length > 0 && (
                <span className="text-sm sm:text-base font-semibold">Tudo em dia! 🎉</span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Medicamentos do dia</h2>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              setEditingMed(null);
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5 mr-1" />
            Adicionar
          </Button>
        </div>

        <MedicationCards
          medications={medications}
          onEdit={(med) => {
            setEditingMed(med);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          onMarkTaken={markAsTaken}
        />
      </main>

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


