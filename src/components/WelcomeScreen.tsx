import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill, Heart } from "lucide-react";

interface Props {
  onComplete: (name: string) => void;
}

export default function WelcomeScreen({ onComplete }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("user_name", name.trim());
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm text-center space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Meus Remédios</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Seu lembrete diário de medicamentos
          </p>
        </div>

        <div className="space-y-3 text-left">
          <label htmlFor="user-name" className="text-base sm:text-lg font-bold text-foreground">
            Como podemos te chamar?
          </label>
          <Input
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="h-14 text-lg sm:h-16 sm:text-xl text-center"
            autoFocus
            required
          />
        </div>

        <Button type="submit" size="xl" className="w-full h-12 sm:h-16 text-base sm:text-xl" disabled={!name.trim()}>
          <Heart className="w-5 h-5 mr-2" />
          Entrar
        </Button>

        <p className="text-sm text-muted-foreground">
          Cadastre uma vez, receba lembretes todos os dias
        </p>
      </form>
    </div>
  );
}

