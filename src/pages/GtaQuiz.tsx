import { useState } from "react";
import { Search, Clock, HelpCircle, ChevronRight, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Quiz {
  id: number;
  title: string;
  theme: string;
  level: string;
  questions: number;
  time: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizzes: Quiz[] = [
  { id: 1, title: "Bases Congés Payés", theme: "Congés Payés", level: "Niveau 1", questions: 10, time: "10 min", difficulty: "Facile" },
  { id: 2, title: "CP fractionnement", theme: "Congés Payés", level: "Niveau 2", questions: 8, time: "12 min", difficulty: "Moyen" },
  { id: 3, title: "CP cas complexes multi-contrats", theme: "Congés Payés", level: "Niveau 3", questions: 6, time: "15 min", difficulty: "Difficile" },
  { id: 4, title: "RTT cadre vs non cadre", theme: "RTT", level: "Niveau 1", questions: 8, time: "8 min", difficulty: "Facile" },
  { id: 5, title: "RTT modulation annuelle", theme: "RTT", level: "Niveau 2", questions: 10, time: "12 min", difficulty: "Moyen" },
  { id: 6, title: "Calcul prorata RTT", theme: "RTT", level: "Niveau 3", questions: 6, time: "10 min", difficulty: "Difficile" },
  { id: 7, title: "Transfert de gestion paie", theme: "Astreinte", level: "Niveau 1", questions: 8, time: "10 min", difficulty: "Moyen" },
  { id: 8, title: "Règles légales astreinte", theme: "Astreinte", level: "Niveau 1", questions: 10, time: "10 min", difficulty: "Facile" },
  { id: 9, title: "Types de rapports GTA", theme: "Création de rapports", level: "Niveau 1", questions: 8, time: "8 min", difficulty: "Facile" },
];

const mockQuestions: Question[] = [
  { question: "Combien de jours ouvrables de CP un salarié acquiert-il par mois de travail effectif ?", options: ["2 jours", "2,08 jours", "2,5 jours", "3 jours"], correct: 2, explanation: "Un salarié acquiert 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours ouvrables pour une année complète." },
  { question: "Quelle est la période légale de prise des congés payés ?", options: ["1er janvier au 31 décembre", "1er mai au 31 octobre", "1er juin au 30 septembre", "1er mai au 31 décembre"], correct: 1, explanation: "La période légale de prise du congé principal est fixée du 1er mai au 31 octobre, sauf accord collectif différent." },
  { question: "Le fractionnement des CP ouvre droit à des jours supplémentaires à partir de combien de jours pris hors période ?", options: ["3 jours", "5 jours", "6 jours", "10 jours"], correct: 0, explanation: "Dès 3 jours de CP pris en dehors de la période légale (hors 5e semaine), le salarié peut bénéficier de jours de fractionnement." },
];

const difficultyClass: Record<string, string> = {
  Facile: "bg-green-500/10 text-green-500",
  Moyen: "bg-orange-500/10 text-orange-500",
  Difficile: "bg-red-500/10 text-red-500",
};

export default function GtaQuiz() {
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState("all");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const themes = ["all", ...Array.from(new Set(quizzes.map((q) => q.theme)))];

  const filtered = quizzes.filter((q) => {
    const matchTheme = themeFilter === "all" || q.theme === themeFilter;
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase());
    return matchTheme && matchSearch;
  });

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setConfirmed(false);
  };

  const confirmAnswer = () => {
    if (selectedAnswer === null) return;
    setConfirmed(true);
    setAnswers((prev) => [...prev, selectedAnswer]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= mockQuestions.length) {
      setShowResult(true);
    } else {
      setCurrentQ((p) => p + 1);
      setSelectedAnswer(null);
      setConfirmed(false);
    }
  };

  const score = answers.filter((a, i) => a === mockQuestions[i]?.correct).length;

  // Quiz taking view
  if (activeQuiz && !showResult) {
    const q = mockQuestions[currentQ];
    if (!q) return null;

    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button onClick={() => setActiveQuiz(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Retour aux entraînements
        </button>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{activeQuiz.title}</h2>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 bg-secondary rounded-full h-2">
              <div className="h-2 rounded-full gradient-primary transition-all duration-500" style={{ width: `${((currentQ + 1) / mockQuestions.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{currentQ + 1}/{mockQuestions.length}</span>
          </div>
        </div>

        <motion.div 
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-3xl p-8 mb-6 shadow-sm"
        >
          <p className="text-lg font-semibold text-foreground mb-8">{q.question}</p>
          <div className="space-y-4">
            {q.options.map((opt, i) => {
              let style = "bg-secondary/50 hover:bg-secondary text-secondary-foreground border border-transparent";
              if (confirmed) {
                if (i === q.correct) style = "bg-green-500/10 text-green-600 border border-green-500/30";
                else if (i === selectedAnswer && i !== q.correct) style = "bg-red-500/10 text-red-600 border border-red-500/30";
              } else if (i === selectedAnswer) {
                style = "bg-primary/10 text-primary border border-primary/30 shadow-sm";
              }
              return (
                <button
                  key={i}
                  onClick={() => !confirmed && setSelectedAnswer(i)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-[15px] font-medium transition-all flex items-center justify-between group ${style}`}
                >
                  <div>
                    <span className="mr-3 opacity-50 text-sm font-bold bg-background/50 px-2 py-1 rounded-md">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </div>
                  {confirmed && i === q.correct && <CheckCircle size={20} className="text-green-500" />}
                  {confirmed && i === selectedAnswer && i !== q.correct && <XCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {confirmed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6 text-blue-700"
            >
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <HelpCircle size={16} /> Explication
              </div>
              <p className="text-sm leading-relaxed">{q.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          {!confirmed ? (
            <button onClick={confirmAnswer} disabled={selectedAnswer === null} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
              Valider ma réponse
            </button>
          ) : (
            <button onClick={nextQuestion} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[15px] font-semibold flex items-center gap-2 shadow-sm">
              {currentQ + 1 >= mockQuestions.length ? "Voir le résultat final" : "Question suivante"}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Result screen
  if (activeQuiz && showResult) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-10 text-center shadow-lg">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-md">
            <span className="text-4xl font-bold text-primary-foreground">{score}/{mockQuestions.length}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {score === mockQuestions.length ? "Excellent ! 🎉" : score >= mockQuestions.length / 2 ? "Bien joué ! 👏" : "Continuez vos efforts ! 💪"}
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Vous avez obtenu {score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""} sur {mockQuestions.length}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 font-semibold mb-1">Bonnes réponses</p>
              <p className="text-3xl font-bold text-green-700">{score}</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-600 font-semibold mb-1">Mauvaises réponses</p>
              <p className="text-3xl font-bold text-red-700">{mockQuestions.length - score}</p>
            </div>
          </div>
          {score < mockQuestions.length && (
            <div className="text-left p-5 rounded-2xl bg-secondary mb-8">
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <HelpCircle size={16} /> Recommandations de l'IA
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">Nous vous conseillons de revoir le module "CP fractionnement" dans la base de connaissances et de demander des cas pratiques à l'assistant GTA PT pour approfondir.</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button onClick={() => startQuiz(activeQuiz)} className="px-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">
              Recommencer
            </button>
            <button onClick={() => setActiveQuiz(null)} className="px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
              Terminer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">GTA Training</h1>
        <p className="text-muted-foreground">Progressez à votre rythme sur les thématiques paie et gestion des temps.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un entraînement..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-[15px] outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
          />
        </div>
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-xl text-[15px] outline-none shadow-sm focus:ring-2 focus:ring-primary/50"
        >
          {themes.map((t) => (
            <option key={t} value={t}>{t === "all" ? "Toutes les thématiques" : t}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => startQuiz(quiz)}
            className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary uppercase tracking-wider">{quiz.theme}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${difficultyClass[quiz.difficulty]}`}>{quiz.difficulty}</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{quiz.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">{quiz.level}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-border/50 text-[13px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><HelpCircle size={14} />{quiz.questions} questions</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{quiz.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
