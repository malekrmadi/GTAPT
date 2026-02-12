import { useState, useRef, useEffect } from "react";
import { Send, Mic, Bot, User, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const agents = [
  "Agent CP", "Agent RTT", "Agent TransGP", "Agent Astreinte",
  "Agent Intranet GTA", "Agent Création de rapports", "Agent Gestion des anomalies",
  "Agent Paramétrage GTA", "Agent Réglementation sociale", "Agent Support client GTA",
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  agent?: string;
}

const mockResponses: Record<string, string> = {
  "Agent CP": "D'après la convention collective applicable, le salarié acquiert 2,5 jours ouvrables de CP par mois de travail effectif. Pour un temps partiel, le calcul reste identique : ce sont les jours ouvrables de la période qui comptent, pas les heures travaillées.",
  "Agent RTT": "Les RTT pour les cadres au forfait jours se calculent ainsi : 365 jours - 104 week-ends - 25 CP - jours fériés tombant un jour ouvré - 218 jours travaillés = nombre de RTT. Pour 2024, cela donne environ 9 jours de RTT.",
  "Agent TransGP": "Lors d'un transfert de gestion paie (TransGP), les compteurs GTA doivent être synchronisés avant la date effective. Vérifiez les soldes CP, RTT et CET, puis validez avec le gestionnaire paie destinataire.",
};

export default function GtaGpt() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [agentOpen, setAgentOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant GTA. Sélectionnez un agent spécialisé et posez votre question. Je suis là pour vous aider sur tous les sujets liés à la Gestion des Temps et Activités.",
      agent: "Agent CP",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = mockResponses[selectedAgent] ||
        `En tant que ${selectedAgent}, je peux vous confirmer que votre demande a bien été prise en compte. N'hésitez pas à préciser votre question pour obtenir une réponse plus détaillée.`;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: response, agent: selectedAgent },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Agent selector */}
      <div className="px-6 py-3 border-b border-border bg-card">
        <div className="relative inline-block">
          <button
            onClick={() => setAgentOpen(!agentOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Bot size={16} className="text-primary" />
            {selectedAgent}
            <ChevronDown size={14} />
          </button>
          {agentOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
              {agents.map((agent) => (
                <button
                  key={agent}
                  onClick={() => { setSelectedAgent(agent); setAgentOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                    agent === selectedAgent ? "text-primary font-medium bg-primary/5" : "text-foreground"
                  }`}
                >
                  {agent}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[600px] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}
            >
              {msg.agent && msg.role === "assistant" && (
                <span className="text-[10px] font-semibold text-primary block mb-1">{msg.agent}</span>
              )}
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User size={16} className="text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <Bot size={16} className="text-primary-foreground" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
            <Mic size={20} />
          </button>
          <div className="flex-1 flex items-center bg-secondary rounded-xl px-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Posez votre question GTA..."
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={sendMessage}
            className="p-2.5 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
