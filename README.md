# PillPal — Gestão Inclusiva de Medicamentos & Rotina

Aplicação web responsiva e focada em acessibilidade (WCAG) para organização, acompanhamento e alertas de medicamentos diários.

---

## 🎯 Proposta de Valor & Problema Real

A adesão correta a tratamentos médicos é um desafio contínuo, especialmente para pessoas com rotinas intensas, idosos ou usuários com dificuldades visuais e cognitivas. 

O **PillPal** foi projetado sob os princípios de **Design Inclusivo, Usabilidade e Acessibilidade**, oferecendo tipografia legível, alto contraste de status, feedback visual/sonoro imediato e persistência diária automática sem necessidade de recadastramento contínuo.

---

## ✨ Principais Funcionalidades

- **Cadastro Único com Repetição Diária:** O usuário cadastra o medicamento uma única vez (nome, horário e dose). O sistema recalcula automaticamente o status no início de cada novo dia via validação de data no armazenamento local.
- **Painel Visual de Triagem com Código de Cores:**
  - 🟢 **Tomado:** Registrado com confirmação imediata.
  - 🟡 **Pendente:** Aguardando o horário previsto.
  - 🔴 **Atrasado:** Medicamento não administrado na janela de tolerância de 30 minutos.
- **Sistema de Alarme e Notificações:**
  - Síntese sonora nativa no navegador via **Web Audio API** (`AudioContext`), dispensando dependência de carregamento de arquivos externos de áudio.
  - Suporte à vibração em dispositivos móveis (`navigator.vibrate`) e notificações de sistema (`Notification API`).
  - Funcionalidade de **Adiar (Snooze):** posterga o alerta em intervalos configuráveis com cálculo de timestamp futuro.
- **Interface Mobile-First:** Touch targets amplos (mínimo de 48px), botões e cartões responsivos adaptados para smartphones e tablets.

---

## 🏗️ Arquitetura e Decisões Técnicas

```
pill-pal/
├── src/
│   ├── components/         # Componentes visuais desacoplados
│   │   ├── ui/             # Primitivos headless estilizados (Radix UI + Tailwind)
│   │   ├── AlarmAlert.tsx  # Modal com feedback sonoro e visual de alerta
│   │   ├── MedicationCards.tsx # Visualização em formato de cards acessíveis
│   │   ├── MedicationForm.tsx  # Formulário com validação
│   │   ├── MedicationTable.tsx # Tabela para visualização tabular
│   │   └── WelcomeScreen.tsx   # Onboarding amigável do usuário
│   ├── hooks/              # Regras de negócio desacopladas da UI
│   │   ├── useMedications.ts # CRUD, ordenação e persistência com ciclo diário
│   │   └── useAlarm.ts       # Loop de monitoramento, Web Audio API e alarmes
│   ├── pages/              # Roteamento (Index, NotFound)
│   ├── test/               # Suíte de testes automatizados com Vitest
│   │   ├── setup.ts
│   │   ├── useMedications.test.ts
│   │   └── useAlarm.test.ts
│   └── types/              # Definições estritas de domínio (Medication, MedicationStatus)
├── vitest.config.ts        # Configuração de ambiente de testes (JSDOM)
├── vite.config.ts          # Configuração de build Vite + SWC
└── package.json
```

- **Separation of Concerns:** Componentes de interface apenas consomem os estados fornecidos pelos custom hooks (`useMedications`, `useAlarm`), isolando completamente a lógica de temporalidade e persistência.
- **Tipagem Estrita com TypeScript:** Interfaces de domínio bem delineadas (`Medication`, `MedicationStatus`) eliminando `any` no consumo de dados.

---

## 🧪 Testes Automatizados

O projeto utiliza **Vitest** com ambiente **JSDOM** e `@testing-library/react`. A suíte cobre integralmente os fluxos de regras de negócio:

- `useMedications.test.ts`:
  - Inicialização com lista vazia.
  - Adição de novos medicamentos com geração de UUID nativo.
  - Ordenação cronológica automática dos horários.
  - Atualização e exclusão de medicamentos.
  - Marcação de status (`taken`, `late`).
  - Adiamento de lembrete com cálculo de timestamp futuro.
- `useAlarm.test.ts`:
  - Estado inicial e descarte de alerta (`dismissAlert`).
  - Disparo de alarme quando o horário do medicamento coincide com a hora atual.
  - Supressão de alarmes para medicamentos já tomados ou sob adiamento ativo.

Para executar os testes:
```bash
npm run test
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ (ou Bun)
- npm ou bun

### Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/anavatrim/pill-pal.git

# Acesse o diretório
cd pill-pal

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Validações de Qualidade
```bash
# Checagem de tipos TypeScript
npx tsc -b

# Execução dos testes unitários
npm run test

# Build de produção
npm run build
```

---

## 📄 Licença
Distribuído sob licença MIT. Consulte `LICENSE` para mais informações.
