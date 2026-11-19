import { Medication } from "@/types/medication";
import { Check, AlertTriangle, Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  medications: Medication[];
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
  onMarkTaken: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    cardBorder: "border-status-pending/50",
    cardBg: "bg-status-pending/5",
    badgeBg: "bg-status-pending/20",
    badgeText: "text-status-pending",
    dot: "bg-status-pending",
    Icon: Clock,
  },
  taken: {
    label: "Tomado ✓",
    cardBorder: "border-status-taken/50",
    cardBg: "bg-status-taken/5",
    badgeBg: "bg-status-taken/20",
    badgeText: "text-status-taken",
    dot: "bg-status-taken",
    Icon: Check,
  },
  late: {
    label: "Atrasado!",
    cardBorder: "border-status-late/50",
    cardBg: "bg-status-late/5",
    badgeBg: "bg-status-late/20",
    badgeText: "text-status-late",
    dot: "bg-status-late",
    Icon: AlertTriangle,
  },
};

export default function MedicationCards({ medications, onEdit, onDelete, onMarkTaken }: Props) {
  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-muted-foreground">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mb-5">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 opacity-40" />
        </div>
        <p className="text-lg sm:text-xl font-bold">Nenhum medicamento</p>
        <p className="text-sm sm:text-base mt-2">Adicione seus remédios e será avisado todo dia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map((med) => {
        const cfg = statusConfig[med.status];
        const Icon = cfg.Icon;

        return (
          <div
            key={med.id}
            className={`rounded-2xl border-2 ${cfg.cardBorder} ${cfg.cardBg} bg-card p-4 sm:p-5 shadow-sm transition-all`}
          >
            {/* Top row: time + status */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{med.time}</span>
              <span className={`inline-flex flex-col gap-2 sm:flex-row sm:items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
                <Icon className="w-4 h-4" />
                {cfg.label}
              </span>
            </div>

            {/* Med info */}
            <div className="mb-4">
              <p className="text-lg sm:text-xl font-bold text-foreground">{med.name}</p>
              <p className="text-base sm:text-lg text-muted-foreground">{med.dose}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {med.status === "pending" && (
                <Button variant="taken" size="lg" onClick={() => onMarkTaken(med.id)} className="w-full sm:flex-1">
                  <Check className="w-5 h-5 mr-2" />
                  Tomei
                </Button>
              )}
              {med.status === "late" && (
                <Button variant="taken" size="lg" onClick={() => onMarkTaken(med.id)} className="w-full sm:flex-1">
                  <Check className="w-5 h-5 mr-2" />
                  Tomar agora
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={() => onEdit(med)} aria-label="Editar" className="h-10 w-10 sm:h-12 sm:w-12">
                <Pencil className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => onDelete(med.id)} aria-label="Excluir" className="h-10 w-10 sm:h-12 sm:w-12">
                <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


