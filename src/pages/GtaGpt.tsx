import { useState, useRef, useEffect } from "react";
import { Send, Mic, Bot, User, Sparkles, Loader2, MessageSquare, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  skillUsed?: string;
  counters?: string[];
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Décompte congés payés",
    date: "Aujourd'hui",
    messages: [
      { id: 1, role: "user", content: "Comment fonctionne le décompte des congés payés ?" },
      { 
        id: 2, 
        role: "assistant", 
        content: "Le décompte des congés payés (CP) s'effectue généralement en jours ouvrables (30 jours par an) ou ouvrés (25 jours par an) selon votre convention collective.\n\nEn jours ouvrés, une semaine de congés correspond à 5 jours décomptés. Si un jour férié chômé tombe pendant la période de congés sur un jour habituellement travaillé, il n'est pas décompté.\n\nSouhaitez-vous que je vérifie le solde actuel d'un collaborateur dans Decidium ?", 
        skillUsed: "Congés Payés",
        counters: ["CP100 - Droit Principal"]
      }
    ]
  },
  {
    id: "conv-2",
    title: "Différence CP100 et CP130",
    date: "Aujourd'hui",
    messages: [
      { id: 1, role: "user", content: "Quelle différence entre CP100, CP130 et CP150 ?" },
      { 
        id: 2, 
        role: "assistant", 
        content: "Voici la codification standard utilisée dans notre environnement GTA :\n\n• **CP100** : Correspond au droit principal d'acquisition légale des congés payés (ex: 2.5 jours ouvrables par mois).\n• **CP130** : Correspond aux congés d'ancienneté. Ces jours sont accordés spécifiquement selon les paliers définis par la convention collective (souvent liés au statut cadre/non-cadre et aux années de présence).\n• **CP150** : Correspond aux jours de fractionnement accordés lorsqu'une partie du congé principal est prise en dehors de la période légale (souvent hors période estivale).\n\nDans Decidium, ces compteurs ont des règles d'alimentation et de péremption distinctes.", 
        skillUsed: "Compteurs GTA",
        counters: ["CP100", "CP130", "CP150"]
      }
    ]
  },
  {
    id: "conv-3",
    title: "RTT et compteurs",
    date: "7 jours précédents",
    messages: [
      { id: 1, role: "user", content: "Quels compteurs GTA sont utilisés pour les RTT forfait jours ?" },
      { 
        id: 2, 
        role: "assistant", 
        content: "Pour les cadres au forfait jours, l'acquisition des RTT est gérée par le compteur **RTT200** (Acquisition Forfait). \nLeur solde se calcule en déduisant les week-ends, les CP (CP100), les jours fériés chômés et le forfait légal (souvent 218 jours) des 365 jours de l'année.\n\nAttention : à la différence des employés horaires (compteur RTT100), les RTT forfait jours ne sont généralement pas reportables d'une année sur l'autre sauf accord d'entreprise.", 
        skillUsed: "RTT & Forfait",
        counters: ["RTT200", "RTT100"]
      }
    ]
  }
];

const availableSkills = [
  { id: "CP", name: "Congés Payés", desc: "Règles d'acquisition, fractionnement, ancienneté" },
  { id: "RTT", name: "RTT & Forfait", desc: "Forfait jours, modulation, compteurs" },
  { id: "AST", name: "Astreinte", desc: "Primes, heures d'intervention, repos" },
  { id: "DEC", name: "Decidium", desc: "Navigation, paramétrage, anomalies" },
];

export default function GtaGpt() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConv, setActiveConv] = useState<string>(mockConversations[0].id);
  
  const currentConversation = mockConversations.find(c => c.id === activeConv) || { messages: [] };
  const [messages, setMessages] = useState<Message[]>(currentConversation.messages);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<number>(0);
  const [detectedSkill, setDetectedSkill] = useState<string | null>(null);

  // Slash commands state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(mockConversations.find(c => c.id === activeConv)?.messages || []);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, thinkingStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1 && !textBeforeCursor.slice(lastSlashIndex).includes(' ')) {
      setShowSlashMenu(true);
      setSlashFilter(textBeforeCursor.slice(lastSlashIndex + 1));
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleSlashSelect = (skillId: string) => {
    const textBeforeSlash = input.slice(0, input.lastIndexOf('/'));
    const newText = `${textBeforeSlash} @${skillId} `;
    setInput(newText);
    setShowSlashMenu(false);
    inputRef.current?.focus();
  };

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    const userMsg: Message = { id: Date.now(), role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSlashMenu(false);
    setIsTyping(true);
    setThinkingStep(1);

    // Simulate thinking process & realism
    let skill = "Knowledge Base";
    let forcedSkill = false;
    if (userText.includes("@CP")) { skill = "Congés Payés"; forcedSkill = true; }
    else if (userText.includes("@RTT")) { skill = "RTT & Forfait"; forcedSkill = true; }
    else if (userText.toLowerCase().includes("compteur") || userText.toLowerCase().includes("rtt")) skill = "Compteurs GTA";

    setTimeout(() => setThinkingStep(2), 800); // Searching rules
    
    setTimeout(() => {
      setThinkingStep(3); // Using skill
      setDetectedSkill(skill);
    }, 1800);
    
    setTimeout(() => setThinkingStep(4), 3000); // Checking GTA counters
    
    setTimeout(() => setThinkingStep(5), 4500); // Building answer

    setTimeout(() => {
      const isCp = userText.toLowerCase().includes("cp") || skill === "Congés Payés";
      const finalResponse = forcedSkill 
        ? `J'ai bien appliqué le contexte restreint du skill **${skill}** pour votre requête. D'après notre base de connaissances sur ce domaine, la réglementation standard s'applique. N'hésitez pas à préciser votre scénario.`
        : (isCp 
            ? "Concernant votre demande sur les CP, la règle dans l'accord d'entreprise stipule que les jours de fractionnement (CP150) s'acquièrent au 31 octobre si le solde principal (CP100) est supérieur ou égal à 3 jours non pris.\n\nLes compteurs d'ancienneté (CP130) ne rentrent pas dans cette base de calcul."
            : "J'ai bien pris en compte votre question. D'après la convention collective, les règles d'absence nécessitent un contrôle sur les compteurs correspondants. Souhaitez-vous que j'analyse l'impact sur un collaborateur en particulier ?");
      
      const counters = isCp ? ["CP150", "CP100", "CP130"] : [];

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: finalResponse, skillUsed: skill, counters },
      ]);
      setIsTyping(false);
      setThinkingStep(0);
      setDetectedSkill(null);
    }, 6000);
  };

  const filteredSkills = availableSkills.filter(s => 
    s.id.toLowerCase().includes(slashFilter.toLowerCase()) || 
    s.name.toLowerCase().includes(slashFilter.toLowerCase())
  );

  return (
    <div className="flex h-full bg-background overflow-hidden relative">
      {/* Sidebar History */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-r border-border bg-card/30 flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <button 
                onClick={() => {
                  setActiveConv("");
                  setMessages([{ id: 1, role: "assistant", content: "Nouvelle conversation. Posez votre question métier !" }]);
                }}
                className="flex-1 flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                <Plus size={16} /> Nouveau chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-6">
              {/* Aujourd'hui */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Aujourd'hui</div>
                <div className="space-y-1">
                  {mockConversations.filter(c => c.date === "Aujourd'hui").map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConv(conv.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 truncate transition-colors ${
                        activeConv === conv.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <MessageSquare size={14} className="shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* 7 jours */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">7 jours précédents</div>
                <div className="space-y-1">
                  {mockConversations.filter(c => c.date === "7 jours précédents").map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConv(conv.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 truncate transition-colors ${
                        activeConv === conv.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <MessageSquare size={14} className="shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Toggle Sidebar Button (when closed) */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground shadow-sm"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        
        {/* Toggle Sidebar Button (when open) */}
        {sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 left-4 z-20 p-2 text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose size={18} />
          </button>
        )}

        {/* Background decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 z-10 pt-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Sparkles size={14} className="text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {msg.skillUsed && msg.role === "assistant" && (
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md text-primary bg-primary/10 border border-primary/20">
                          <Bot size={12} />
                          Skill: {msg.skillUsed}
                        </div>
                        {msg.counters?.map(counter => (
                          <div key={counter} className="text-[10px] font-bold px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                            {counter}
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-br-sm"
                          : "bg-card border border-border rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Loader2 size={14} className="text-muted-foreground animate-spin" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm min-w-[280px]">
                  <div className="space-y-3">
                    <div className={`text-sm flex items-center gap-2 transition-colors ${thinkingStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      <Sparkles size={14} className={thinkingStep === 1 ? "animate-pulse text-primary" : ""} /> 
                      Analyse de la requête métier...
                    </div>
                    <div className={`text-sm flex items-center gap-2 transition-colors ${thinkingStep >= 2 ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
                      <Bot size={14} className={thinkingStep === 2 ? "animate-pulse text-primary" : ""} /> 
                      Recherche des règles de paie...
                    </div>
                    <div className={`text-sm flex items-center gap-2 transition-colors ${thinkingStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground opacity-50'}`}>
                      <Bot size={14} className={thinkingStep === 3 ? "animate-pulse" : ""} /> 
                      {detectedSkill ? `Using Skill : ${detectedSkill}` : "Using Skill : Knowledge Base"}
                    </div>
                    <div className={`text-sm flex items-center gap-2 transition-colors ${thinkingStep >= 4 ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
                      <Sparkles size={14} className={thinkingStep === 4 ? "animate-pulse text-primary" : ""} /> 
                      Vérification des compteurs GTA...
                    </div>
                    <div className={`text-sm flex items-center gap-2 transition-colors ${thinkingStep >= 5 ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>
                      <Sparkles size={14} className={thinkingStep === 5 ? "animate-pulse text-primary" : ""} /> 
                      Génération de la réponse...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-border z-10">
          <div className="max-w-3xl mx-auto relative group">
            
            {/* Slash Commands Menu */}
            <AnimatePresence>
              {showSlashMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-0 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-3 py-2 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground">
                    Forcer un Skill spécifique
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filteredSkills.map(skill => (
                      <button
                        key={skill.id}
                        onClick={() => handleSlashSelect(skill.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary flex flex-col gap-0.5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">/{skill.id}</span>
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate">{skill.desc}</span>
                      </button>
                    ))}
                    {filteredSkills.length === 0 && (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        Aucun skill trouvé
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
            <div className="relative flex items-center gap-3 bg-card border border-border rounded-2xl px-2 py-2 shadow-lg">
              <button className="p-3 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Mic size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !showSlashMenu) sendMessage();
                }}
                placeholder="Tapez / pour choisir un skill ou posez votre question métier..."
                className="flex-1 bg-transparent py-3 text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="text-center mt-3 text-[11px] text-muted-foreground font-medium">
              L'IA peut faire des erreurs. Vérifiez toujours les règles légales et les conventions applicables.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
