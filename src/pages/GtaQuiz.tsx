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
  { id: 7, title: "Transfert de gestion paie", theme: "TransGP", level: "Niveau 1", questions: 8, time: "10 min", difficulty: "Moyen" },
  { id: 8, title: "Règles légales astreinte", theme: "Astreinte", level: "Niveau 1", questions: 10, time: "10 min", difficulty: "Facile" },
  { id: 9, title: "Types de rapports GTA", theme: "Création de rapports", level: "Niveau 1", questions: 8, time: "8 min", difficulty: "Facile" },
];

const mockQuestions: Question[] = [
  { question: "Combien de jours ouvrables de CP un salarié acquiert-il par mois de travail effectif ?", options: ["2 jours", "2,08 jours", "2,5 jours", "3 jours"], correct: 2, explanation: "Un salarié acquiert 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours ouvrables pour une année complète." },
  { question: "Quelle est la période légale de prise des congés payés ?", options: ["1er janvier au 31 décembre", "1er mai au 31 octobre", "1er juin au 30 septembre", "1er mai au 31 décembre"], correct: 1, explanation: "La période légale de prise du congé principal est fixée du 1er mai au 31 octobre, sauf accord collectif différent." },
  { question: "Le fractionnement des CP ouvre droit à des jours supplémentaires à partir de combien de jours pris hors période ?", options: ["3 jours", "5 jours", "6 jours", "10 jours"], correct: 0, explanation: "Dès 3 jours de CP pris en dehors de la période légale (hors 5e semaine), le salarié peut bénéficier de jours de fractionnement." },
];

const difficultyClass: Record<string, string> = {
  Facile: "badge-easy",
  Moyen: "badge-medium",
  Difficile: "badge-hard",
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
      <div className="p-6 max-w-2xl mx-auto">
        <button onClick={() => setActiveQuiz(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Retour aux quiz
        </button>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">{activeQuiz.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-secondary rounded-full h-2">
              <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${((currentQ + 1) / mockQuestions.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{currentQ + 1}/{mockQuestions.length}</span>
          </div>
        </div>

        <div className="elevated-card p-6 mb-4">
          <p className="font-semibold text-foreground mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-transparent";
              if (confirmed) {
                if (i === q.correct) style = "bg-success/10 text-success border border-success/30";
                else if (i === selectedAnswer && i !== q.correct) style = "bg-destructive/10 text-destructive border border-destructive/30";
              } else if (i === selectedAnswer) {
                style = "bg-primary/10 text-primary border border-primary/30";
              }
              return (
                <button
                  key={i}
                  onClick={() => !confirmed && setSelectedAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${style}`}
                >
                  <span className="mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {confirmed && i === q.correct && <CheckCircle size={16} className="inline ml-2" />}
                  {confirmed && i === selectedAnswer && i !== q.correct && <XCircle size={16} className="inline ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {confirmed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="elevated-card p-4 mb-4 border-l-4 border-l-info">
            <p className="text-xs font-semibold text-info mb-1">Explication</p>
            <p className="text-sm text-muted-foreground">{q.explanation}</p>
          </motion.div>
        )}

        <div className="flex justify-end">
          {!confirmed ? (
            <button onClick={confirmAnswer} disabled={selectedAnswer === null} className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity">
              Valider
            </button>
          ) : (
            <button onClick={nextQuestion} className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
              {currentQ + 1 >= mockQuestions.length ? "Voir le résultat" : "Suivant"}
              <ChevronRight size={16} className="inline ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Result screen
  if (activeQuiz && showResult) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="elevated-card p-8 text-center">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-primary-foreground">{score}/{mockQuestions.length}</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {score === mockQuestions.length ? "Excellent ! 🎉" : score >= mockQuestions.length / 2 ? "Bien joué ! 👏" : "Continuez vos efforts ! 💪"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Vous avez obtenu {score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""} sur {mockQuestions.length}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="p-3 rounded-xl bg-success/10">
              <p className="text-xs text-success font-semibold">Bonnes réponses</p>
              <p className="text-2xl font-bold text-success">{score}</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <p className="text-xs text-destructive font-semibold">Mauvaises réponses</p>
              <p className="text-2xl font-bold text-destructive">{mockQuestions.length - score}</p>
            </div>
          </div>
          {score < mockQuestions.length && (
            <div className="text-left p-4 rounded-xl bg-secondary mb-6">
              <p className="text-xs font-semibold text-foreground mb-2">📚 Recommandations</p>
              <p className="text-xs text-muted-foreground">Nous vous conseillons de revoir le quiz "CP fractionnement" et de consulter l'Agent CP pour approfondir vos connaissances.</p>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={() => startQuiz(activeQuiz)} className="px-5 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium">
              Recommencer
            </button>
            <button onClick={() => setActiveQuiz(null)} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">
              Retour aux quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-1">GTA Quiz</h2>
      <p className="text-sm text-muted-foreground mb-6">Testez vos connaissances GTA</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un quiz..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm outline-none"
        >
          {themes.map((t) => (
            <option key={t} value={t}>{t === "all" ? "Toutes thématiques" : t}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={() => startQuiz(quiz)}
            className="elevated-card p-4 cursor-pointer hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{quiz.theme}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyClass[quiz.difficulty]}`}>{quiz.difficulty}</span>
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{quiz.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{quiz.level}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><HelpCircle size={12} />{quiz.questions} questions</span>
              <span className="flex items-center gap-1"><Clock size={12} />{quiz.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
