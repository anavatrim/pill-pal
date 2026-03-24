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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Pill className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Meus Remédios</h1>
          <p className="text-lg text-muted-foreground">
            Seu lembrete diário de medicamentos
          </p>
        </div>

        <div className="space-y-3 text-left">
          <label htmlFor="user-name" className="text-lg font-bold text-foreground">
            Como podemos te chamar?
          </label>
          <Input
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="h-16 text-xl text-center"
            autoFocus
            required
          />
        </div>

        <Button type="submit" size="xl" className="w-full" disabled={!name.trim()}>
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
