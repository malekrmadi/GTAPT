import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Ticket,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navItems = [
  { path: "/", label: "GTA GPT", icon: MessageSquare, desc: "Chatbot IA" },
  { path: "/chrome", label: "GTA Chrome", icon: Search, desc: "Recherche" },
  { path: "/quiz", label: "GTA Quiz", icon: GraduationCap, desc: "Évaluations" },
  { path: "/exam", label: "GTA Exam", icon: ClipboardCheck, desc: "Examens" },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3, desc: "Analytique" },
  { path: "/tickets", label: "My Tickets", icon: Ticket, desc: "Tickets" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sidebar-gradient flex flex-col border-r border-sidebar-border shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-primary-foreground font-bold text-sm leading-none">AGP GTA</h1>
                <p className="text-sidebar-foreground text-[10px] mt-0.5">Gestion Temps & Activités</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:text-primary-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && (
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? "text-primary-foreground/70" : "text-sidebar-foreground/60"
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-semibold">
                JD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-primary-foreground truncate">Jean Dupont</p>
                <p className="text-[10px] text-sidebar-foreground truncate">Conseiller GTA</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {navItems.find((n) => n.path === location.pathname)?.icon &&
              (() => {
                const Icon = navItems.find((n) => n.path === location.pathname)?.icon ?? MessageSquare;
                return <Icon size={16} className="text-primary" />;
              })()}
            <span className="font-semibold text-foreground">
              {navItems.find((n) => n.path === location.pathname)?.label ?? "GTA GPT"}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
