import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface ExamQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface Exercise {
  id: string;
  title: string;
  questions: ExamQuestion[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  status: "draft" | "published";
  createdAt: string;
}

const emptyQuestion = (): ExamQuestion => ({
  id: `q-${Date.now()}`,
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  explanation: "",
});

const emptyExercise = (): Exercise => ({
  id: `ex-${Date.now()}`,
  title: "",
  questions: [emptyQuestion()],
});

const initialExams: Exam[] = [
  {
    id: "exam-1",
    title: "Bases Congés Payés",
    description: "Training de mise en pratique sur l'acquisition et la prise des congés payés.",
    status: "published",
    createdAt: "10/06/2026",
    exercises: [
      {
        id: "ex-1",
        title: "Acquisition des CP",
        questions: [
          {
            id: "q-1",
            question: "Combien de jours ouvrables de CP un salarié acquiert-il par mois ?",
            options: ["2 jours", "2,08 jours", "2,5 jours", "3 jours"],
            correct: 2,
            explanation: "Un salarié acquiert 2,5 jours ouvrables de congés payés par mois de travail effectif.",
          },
        ],
      },
    ],
  },
  {
    id: "exam-2",
    title: "RTT — Cadres au forfait jours",
    description: "Training sur les règles de calcul et de gestion des RTT pour les cadres.",
    status: "draft",
    createdAt: "12/06/2026",
    exercises: [
      {
        id: "ex-2",
        title: "Calcul du droit RTT",
        questions: [
          {
            id: "q-2",
            question: "Les RTT sont-ils reportables sur N+1 par défaut ?",
            options: ["Oui, automatiquement", "Non, sauf accord d'entreprise", "Oui, jusqu'à 5 jours", "Non, jamais"],
            correct: 1,
            explanation: "Les RTT ne sont pas reportables sur N+1 sauf accord d'entreprise explicite.",
          },
        ],
      },
    ],
  },
];

interface Props {
  exams: Exam[];
  onExamsChange: (exams: Exam[]) => void;
}

export default function ExamManagement({ exams, onExamsChange }: Props) {
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCreate = () => {
    setEditingExam({
      id: `exam-${Date.now()}`,
      title: "",
      description: "",
      exercises: [emptyExercise()],
      status: "draft",
      createdAt: new Date().toLocaleDateString("fr-FR"),
    });
    setIsCreating(true);
  };

  const saveExam = () => {
    if (!editingExam?.title.trim()) {
      toast.error("Le titre du training est requis.");
      return;
    }
    const hasEmptyExercise = editingExam.exercises.some((ex) => !ex.title.trim());
    if (hasEmptyExercise) {
      toast.error("Chaque exercice doit avoir un titre.");
      return;
    }

    const exists = exams.find((e) => e.id === editingExam.id);
    if (exists) {
      onExamsChange(exams.map((e) => (e.id === editingExam.id ? editingExam : e)));
    } else {
      onExamsChange([editingExam, ...exams]);
    }
    toast.success(`Training "${editingExam.title}" enregistré.`);
    setEditingExam(null);
    setIsCreating(false);
  };

  const deleteExam = (id: string) => {
    onExamsChange(exams.filter((e) => e.id !== id));
    toast.success("Training supprimé.");
  };

  const updateExam = (patch: Partial<Exam>) => {
    if (!editingExam) return;
    setEditingExam({ ...editingExam, ...patch });
  };

  const addExercise = () => {
    if (!editingExam) return;
    updateExam({ exercises: [...editingExam.exercises, emptyExercise()] });
  };

  const removeExercise = (exId: string) => {
    if (!editingExam || editingExam.exercises.length <= 1) return;
    updateExam({ exercises: editingExam.exercises.filter((ex) => ex.id !== exId) });
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
    if (!editingExam) return;
    const next = index + direction;
    if (next < 0 || next >= editingExam.exercises.length) return;
    const arr = [...editingExam.exercises];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    updateExam({ exercises: arr });
  };

  const updateExercise = (exId: string, patch: Partial<Exercise>) => {
    if (!editingExam) return;
    updateExam({
      exercises: editingExam.exercises.map((ex) => (ex.id === exId ? { ...ex, ...patch } : ex)),
    });
  };

  const addQuestion = (exId: string) => {
    if (!editingExam) return;
    updateExercise(exId, {
      questions: [...(editingExam.exercises.find((e) => e.id === exId)?.questions || []), emptyQuestion()],
    });
  };

  const removeQuestion = (exId: string, qId: string) => {
    if (!editingExam) return;
    const ex = editingExam.exercises.find((e) => e.id === exId);
    if (!ex || ex.questions.length <= 1) return;
    updateExercise(exId, { questions: ex.questions.filter((q) => q.id !== qId) });
  };

  const updateQuestion = (exId: string, qId: string, patch: Partial<ExamQuestion>) => {
    if (!editingExam) return;
    const ex = editingExam.exercises.find((e) => e.id === exId);
    if (!ex) return;
    updateExercise(exId, {
      questions: ex.questions.map((q) => (q.id === qId ? { ...q, ...patch } : q)),
    });
  };

  const updateOption = (exId: string, qId: string, optIndex: number, value: string) => {
    if (!editingExam) return;
    const ex = editingExam.exercises.find((e) => e.id === exId);
    const q = ex?.questions.find((qq) => qq.id === qId);
    if (!q) return;
    const options = [...q.options] as [string, string, string, string];
    options[optIndex] = value;
    updateQuestion(exId, qId, { options });
  };

  // ── Éditeur de training ──
  if (editingExam) {
    const totalQuestions = editingExam.exercises.reduce((s, ex) => s + ex.questions.length, 0);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <button
          onClick={() => { setEditingExam(null); setIsCreating(false); }}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Retour à la liste
        </button>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">{isCreating ? "Créer un training" : "Modifier le training"}</h2>
            <p className="text-sm text-muted-foreground">Définissez le contenu pédagogique et les questions à choix multiples.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Titre du training</label>
              <input
                value={editingExam.title}
                onChange={(e) => updateExam({ title: e.target.value })}
                placeholder="Ex: Training Congés Payés — Niveau 1"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Statut</label>
              <select
                value={editingExam.status}
                onChange={(e) => updateExam({ status: e.target.value as "draft" | "published" })}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              value={editingExam.description}
              onChange={(e) => updateExam({ description: e.target.value })}
              placeholder="Décrivez l'objectif pédagogique de cet examen..."
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          {/* Exercices */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Exercices ({editingExam.exercises.length}) — {totalQuestions} question{totalQuestions > 1 ? "s" : ""}
              </h3>
              <button
                onClick={addExercise}
                className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
              >
                <Plus size={16} /> Ajouter un exercice
              </button>
            </div>

            {editingExam.exercises.map((exercise, exIndex) => (
              <div key={exercise.id} className="border border-border rounded-2xl overflow-hidden">
                <div className="bg-secondary/50 px-6 py-4 flex items-center gap-3 border-b border-border">
                  <GripVertical size={16} className="text-muted-foreground shrink-0" />
                  <input
                    value={exercise.title}
                    onChange={(e) => updateExercise(exercise.id, { title: e.target.value })}
                    placeholder={`Titre de l'exercice ${exIndex + 1}`}
                    className="flex-1 bg-transparent font-bold text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveExercise(exIndex, -1)} disabled={exIndex === 0} className="p-1.5 hover:bg-secondary rounded-lg disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => moveExercise(exIndex, 1)} disabled={exIndex === editingExam.exercises.length - 1} className="p-1.5 hover:bg-secondary rounded-lg disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                    <button onClick={() => removeExercise(exercise.id)} disabled={editingExam.exercises.length <= 1} className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg disabled:opacity-30">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {exercise.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-background border border-border rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Question {qIndex + 1}</span>
                        {exercise.questions.length > 1 && (
                          <button onClick={() => removeQuestion(exercise.id, q.id)} className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <input
                        value={q.question}
                        onChange={(e) => updateQuestion(exercise.id, q.id, { question: e.target.value })}
                        placeholder="Saisissez la question..."
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                      />

                      <div className="space-y-2">
                        {(["A", "B", "C", "D"] as const).map((letter, optIndex) => (
                          <div key={letter} className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuestion(exercise.id, q.id, { correct: optIndex as 0 | 1 | 2 | 3 })}
                              className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                                q.correct === optIndex
                                  ? "bg-green-500 text-white"
                                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                              }`}
                              title="Définir comme bonne réponse"
                            >
                              {letter}
                            </button>
                            <input
                              value={q.options[optIndex]}
                              onChange={(e) => updateOption(exercise.id, q.id, optIndex, e.target.value)}
                              placeholder={`Choix ${letter}`}
                              className={`flex-1 px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                                q.correct === optIndex
                                  ? "border-green-500/50 bg-green-500/5"
                                  : "border-border bg-secondary/50 focus:ring-2 focus:ring-primary/50"
                              }`}
                            />
                            {q.correct === optIndex && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                          <HelpCircle size={12} /> Explication (optionnelle)
                        </label>
                        <textarea
                          value={q.explanation}
                          onChange={(e) => updateQuestion(exercise.id, q.id, { explanation: e.target.value })}
                          placeholder="Expliquez la bonne réponse..."
                          className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm h-20 resize-none outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addQuestion(exercise.id)}
                    className="w-full py-2.5 border border-dashed border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Ajouter une question
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <button onClick={() => { setEditingExam(null); setIsCreating(false); }} className="px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors">
              Annuler
            </button>
            <button onClick={saveExam} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md">
              <Save size={18} /> Enregistrer le training
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Liste des trainings ──
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Trainings</h2>
          <p className="text-sm text-muted-foreground mt-1">Créez et organisez des trainings e-learning (exercices + QCM).</p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors shadow-lg"
        >
          <Plus size={18} /> Créer un training
        </button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {exams.map((exam) => {
            const qCount = exam.exercises.reduce((s, ex) => s + ex.questions.length, 0);
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        exam.status === "published" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                      }`}>
                        {exam.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{exam.createdAt}</span>
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{exam.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{exam.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
                      <span>{exam.exercises.length} exercice{exam.exercises.length > 1 ? "s" : ""}</span>
                      <span>•</span>
                      <span>{qCount} question{qCount > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingExam(exam); setIsCreating(false); }}
                      className="px-4 py-2 bg-secondary rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { initialExams };
