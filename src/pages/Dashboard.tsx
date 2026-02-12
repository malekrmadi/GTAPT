import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Award, BookOpen, FileCheck, Ticket as TicketIcon, Timer } from "lucide-react";

const kpis = [
  { label: "Quiz réalisés", value: "47", change: "+12%", icon: BookOpen, color: "text-info" },
  { label: "Score moyen", value: "78%", change: "+5%", icon: Target, color: "text-success" },
  { label: "Temps moyen/quiz", value: "8 min", change: "-15%", icon: Clock, color: "text-warning" },
  { label: "Taux réussite", value: "82%", change: "+8%", icon: Award, color: "text-primary" },
  { label: "Examens passés", value: "12", change: "+3", icon: FileCheck, color: "text-info" },
  { label: "Réussite examens", value: "75%", change: "+10%", icon: TrendingUp, color: "text-success" },
  { label: "Tickets résolus", value: "156", change: "+24", icon: TicketIcon, color: "text-warning" },
  { label: "Temps moy. ticket", value: "45 min", change: "-20%", icon: Timer, color: "text-primary" },
];

const themePerf = [
  { theme: "Congés Payés", score: 92, quizzes: 8 },
  { theme: "RTT", score: 85, quizzes: 6 },
  { theme: "Astreintes", score: 78, quizzes: 4 },
  { theme: "TransGP", score: 65, quizzes: 3 },
  { theme: "Paramétrage GTA", score: 70, quizzes: 5 },
  { theme: "Heures supplémentaires", score: 88, quizzes: 4 },
  { theme: "Support client", score: 82, quizzes: 6 },
];

const monthlyProgress = [
  { month: "Sept", score: 62 },
  { month: "Oct", score: 68 },
  { month: "Nov", score: 72 },
  { month: "Déc", score: 75 },
  { month: "Jan", score: 78 },
  { month: "Fév", score: 82 },
];

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-1">Dashboard</h2>
      <p className="text-sm text-muted-foreground mb-6">Vue d'ensemble de votre progression GTA</p>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="elevated-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <kpi.icon size={18} className={kpi.color} />
              <span className="text-[10px] font-semibold text-success">{kpi.change}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly progress chart (simple bar) */}
        <div className="elevated-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Progression mensuelle</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyProgress.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-foreground">{m.score}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${m.score}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-full rounded-t-md gradient-primary min-h-[4px]"
                />
                <span className="text-[10px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theme performance */}
        <div className="elevated-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Performance par thématique</h3>
          <div className="space-y-3">
            {themePerf.map((t) => (
              <div key={t.theme}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{t.theme}</span>
                  <span className="text-muted-foreground">{t.score}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.score}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`h-2 rounded-full ${t.score >= 80 ? "bg-success" : t.score >= 60 ? "bg-warning" : "bg-destructive"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
