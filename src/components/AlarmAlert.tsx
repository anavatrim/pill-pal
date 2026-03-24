import { Medication } from "@/types/medication";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface Props {
  medication: Medication;
  onTaken: (id: string) => void;
  onSnooze: (id: string) => void;
}

export default function AlarmAlert({ medication, onTaken, onSnooze }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
        <div className="mx-auto w-20 h-20 rounded-full bg-status-pending/20 flex items-center justify-center animate-pulse">
          <Bell className="w-10 h-10 text-status-pending" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold">Hora do Remédio!</h2>
          <p className="text-xl mt-2 text-muted-foreground">{medication.time}</p>
        </div>

        <div className="bg-secondary rounded-xl p-4">
          <p className="text-2xl font-bold">{medication.name}</p>
          <p className="text-lg text-muted-foreground">{medication.dose}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="snooze"
            size="xl"
            onClick={() => onSnooze(medication.id)}
            className="text-lg"
          >
            ⏰ Adiar
          </Button>
          <Button
            variant="taken"
            size="xl"
            onClick={() => onTaken(medication.id)}
            className="text-lg"
          >
            ✅ Tomei
          </Button>
        </div>
      </div>
    </div>
  );
}
