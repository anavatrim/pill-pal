import { Medication } from "@/types/medication";
import { Check, AlertTriangle, Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  medications: Medication[];
  onEdit: (med: Medication) => void;
  onDelete: (id: string) => void;
  onMarkTaken: (id: string) => void;
}

const statusMap = {
  pending: { label: "Pendente", bg: "bg-status-pending/20", text: "text-status-pending", dot: "bg-status-pending", Icon: Clock },
  taken: { label: "Tomado", bg: "bg-status-taken/20", text: "text-status-taken", dot: "bg-status-taken", Icon: Check },
  late: { label: "Atrasado", bg: "bg-status-late/20", text: "text-status-late", dot: "bg-status-late", Icon: AlertTriangle },
};

export default function MedicationTable({ medications, onEdit, onDelete, onMarkTaken }: Props) {
  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-muted-foreground">
        <Clock className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-30" />
        <p className="text-lg sm:text-xl font-bold">Nenhum medicamento</p>
        <p className="text-sm sm:text-base mt-1">Adicione seus remédios e será avisado todo dia</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-sm">
      {/* Table Header */}
      <div className="grid grid-cols-[60px_1fr_auto] sm:grid-cols-[80px_1fr_1fr_120px_auto] items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-secondary font-bold text-xs sm:text-sm text-muted-foreground uppercase tracking-wide border-b-2 border-border">
        <span>Hora</span>
        <span>Remédio</span>
        <span className="hidden sm:block">Dose</span>
        <span className="hidden sm:block text-center">Status</span>
        <span className="text-center">Ações</span>
      </div>

      {/* Table Rows */}
      {medications.map((med) => {
        const s = statusMap[med.status];
        return (
          <div
            key={med.id}
            className="grid grid-cols-[60px_1fr_auto] sm:grid-cols-[80px_1fr_1fr_120px_auto] items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 border-b border-border last:border-b-0 hover:bg-secondary/40 transition-colors"
          >
            {/* Time */}
            <span className="text-lg sm:text-2xl font-extrabold">{med.time}</span>

            {/* Name */}
            <span className="text-sm sm:text-lg font-bold truncate">{med.name}</span>

            {/* Dose */}
            <span className="hidden sm:block text-sm text-muted-foreground truncate">{med.dose}</span>

            {/* Status badge (desktop) */}
            <div className="hidden sm:flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${s.bg} ${s.text}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1">
              {/* Mobile status dot */}
              <span className={`sm:hidden w-3.5 h-3.5 rounded-full ${s.dot} mr-1`} />

              {med.status === "pending" && (
                <Button
                  variant="taken"
                  size="sm"
                  onClick={() => onMarkTaken(med.id)}
                  aria-label="Marcar como tomado"
                  className="text-[10px] sm:text-xs px-2 h-8 sm:h-9"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onEdit(med)} aria-label="Editar" className="h-8 w-8 sm:h-9 sm:w-9">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(med.id)} aria-label="Excluir" className="h-8 w-8 sm:h-9 sm:w-9">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

