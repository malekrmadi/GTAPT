import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import ExamManagement, { initialExams, type Exam } from "@/pages/manager/ExamManagement";

export default function ManagerTrainingBuilderPage() {
  const [trainings, setTrainings] = useState<Exam[]>(initialExams);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="flex items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap size={22} className="text-primary" /> Trainings (e-learning)
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez des parcours d'entraînement avec exercices et QCM, pour une expérience e-learning cohérente.
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-h-0">
        <ExamManagement exams={trainings} onExamsChange={setTrainings} />
      </motion.div>
    </div>
  );
}
