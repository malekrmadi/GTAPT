import { useState, useEffect, useCallback } from "react";
import { Clock, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const levels = ["Junior", "Intermédiaire", "Senior", "Expert GTA"];

interface ExamQuestion {
  type: "mcq" | "open";
  question: string;
  context?: string;
  options?: string[];
  correct?: number;
}

const examQuestions: ExamQuestion[] = [
  { type: "mcq", question: "Un salarié en CDD de 6 mois a-t-il droit aux congés payés dès son premier jour de travail ?", options: ["Oui, dès le premier jour", "Non, après 1 mois", "Non, après 3 mois", "Seulement en CDI"], correct: 0 },
  { type: "open", question: "Un client signale que le compteur RTT de son salarié affiche un solde négatif. Rédigez la réponse que vous lui enverriez.", context: "Ticket client #4521 - Entreprise ACME SAS - Convention Syntec" },
  { type: "mcq", question: "Lors d'un TransGP, quel élément doit être synchronisé en priorité ?", options: ["Les fiches de paie", "Les compteurs de temps (CP, RTT, CET)", "L'organigramme", "Les notes de frais"], correct: 1 },
  { type: "open", question: "Expliquez la procédure de paramétrage d'un nouveau compteur d'heures supplémentaires dans l'outil GTA.", context: "Contexte : Mise en place d'un accord d'entreprise sur les HS" },
  { type: "mcq", question: "Quelle est la durée maximale légale d'une période d'astreinte hebdomadaire ?", options: ["24 heures", "48 heures", "Pas de limite légale spécifique", "35 heures"], correct: 2 },
];

export default function GtaExam() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [timer, setTimer] = useState(30);
  const [answers, setAnswers] = useState<(string | number | null)[]>([]);
  const [openAnswer, setOpenAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [examDone, setExamDone] = useState(false);

  const submitAnswer = useCallback(() => {
    const q = examQuestions[currentQ];
    if (!q) return;
    const answer = q.type === "open" ? openAnswer : answers[currentQ] ?? null;
    const newAnswers = [...answers];
    newAnswers[currentQ] = answer;
    setAnswers(newAnswers);

    if (currentQ + 1 >= examQuestions.length) {
      setExamDone(true);
    } else {
      setCurrentQ((p) => p + 1);
      setTimer(30);
      setOpenAnswer("");
      setSubmitted(false);
    }
  }, [currentQ, openAnswer, answers]);

  useEffect(() => {
    if (!selectedLevel || examDone) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          submitAnswer();
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedLevel, examDone, currentQ, submitAnswer]);

  // Level selection
  if (!selectedLevel) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-1">GTA Exam</h2>
        <p className="text-sm text-muted-foreground mb-8">Examens chronométrés pour évaluer vos compétences GTA</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {levels.map((level, i) => (
            <motion.button
              key={level}
              whileHover={{ y: -2 }}
              onClick={() => { setSelectedLevel(level); setTimer(30); setCurrentQ(0); setAnswers([]); setExamDone(false); }}
              className="elevated-card p-6 text-left hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{level}</h3>
                  <p className="text-[11px] text-muted-foreground">{examQuestions.length} questions · 30s/question</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Result
  if (examDone) {
    const mcqScore = examQuestions.filter((q, i) => q.type === "mcq" && answers[i] === q.correct).length;
    const totalMcq = examQuestions.filter((q) => q.type === "mcq").length;
    const openAnswered = examQuestions.filter((q, i) => q.type === "open" && answers[i] && String(answers[i]).length > 10).length;
    const totalOpen = examQuestions.filter((q) => q.type === "open").length;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="elevated-card p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">Examen terminé !</h2>
            <p className="text-sm text-muted-foreground">Niveau : {selectedLevel}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground font-medium">QCM</p>
              <p className="text-2xl font-bold text-foreground">{mcqScore}/{totalMcq}</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary">
              <p className="text-xs text-muted-foreground font-medium">Questions ouvertes</p>
              <p className="text-2xl font-bold text-foreground">{openAnswered}/{totalOpen}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary mb-6">
            <p className="text-xs font-semibold text-foreground mb-2">📋 Recommandations</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Revoir le quiz "TransGP" pour renforcer vos connaissances</li>
              <li>• Consulter l'Agent Paramétrage GTA pour les compteurs</li>
              <li>• Pratiquer la rédaction de réponses client avec l'Agent Support</li>
            </ul>
          </div>

          <p className="text-center text-sm text-foreground font-medium mb-6">
            {mcqScore >= totalMcq * 0.8 ? "🌟 Excellente performance ! Vous maîtrisez les fondamentaux." : "💪 Bon effort ! Continuez à vous former."}
          </p>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSelectedLevel(null); }} className="px-5 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium">
              Choisir un niveau
            </button>
            <button onClick={() => { setCurrentQ(0); setAnswers([]); setExamDone(false); setTimer(30); setOpenAnswer(""); }} className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">
              Recommencer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Exam taking
  const q = examQuestions[currentQ];
  if (!q) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => setSelectedLevel(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Quitter l'examen
      </button>

      {/* Timer + progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className={timer <= 10 ? "text-destructive" : "text-muted-foreground"} />
          <span className={`text-2xl font-bold tabular-nums ${timer <= 10 ? "text-destructive" : "text-foreground"}`}>
            {timer}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 bg-secondary rounded-full h-2">
            <div className="h-2 rounded-full gradient-primary transition-all" style={{ width: `${((currentQ + 1) / examQuestions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{currentQ + 1}/{examQuestions.length}</span>
        </div>
      </div>

      <div className="elevated-card p-6">
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary mb-3">
          {q.type === "mcq" ? "QCM" : "Question ouverte"}
        </span>
        {q.context && (
          <div className="p-3 rounded-lg bg-secondary mb-4">
            <p className="text-xs text-muted-foreground italic">{q.context}</p>
          </div>
        )}
        <p className="font-semibold text-foreground mb-6">{q.question}</p>

        {q.type === "mcq" && q.options ? (
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => { const newA = [...answers]; newA[currentQ] = i; setAnswers(newA); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  answers[currentQ] === i
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Rédigez votre réponse..."
            rows={5}
            className="w-full p-4 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:ring-2 focus:ring-primary/20"
          />
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={submitAnswer} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
          <Send size={16} /> Soumettre
        </button>
      </div>
    </div>
  );
}
