import { Medication } from "@/types/medication";
import { Clock, Check, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  medications: Medication[];
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    className: "bg-status-pending/20 text-status-pending border-status-pending/30",
    icon: Clock,
  },
  taken: {
    label: "Tomado ✓",
    className: "bg-status-taken/20 text-status-taken border-status-taken/30",
    icon: Check,
  },
  late: {
    label: "Atrasado",
    className: "bg-status-late/20 text-status-late border-status-late/30",
    icon: AlertTriangle,
  },
};

export default function MedicationList({ medications, onEdit, onDelete }: Props) {
  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Clock className="w-16 h-16 mb-4 opacity-40" />
        <p className="text-xl font-semibold">Nenhum medicamento cadastrado</p>
        <p className="text-base mt-1">Toque em "Adicionar" para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((med) => {
        const cfg = statusConfig[med.status];
        const Icon = cfg.icon;
        return (
          <div
            key={med.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 bg-card shadow-sm transition-all ${cfg.className}`}
          >
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-2xl font-bold leading-none">{med.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold truncate">{med.name}</p>
              <p className="text-base text-muted-foreground">{med.dose}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg">
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => onEdit(med)} aria-label="Editar">
                <Pencil className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(med.id)} aria-label="Excluir">
                <Trash2 className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
