import { useState } from "react";
import Icon from "@/components/ui/icon";
import Home from "./Home";
import Dialogs from "./Dialogs";
import Lessons from "./Lessons";
import Languages from "./Languages";
import Media from "./Media";
import Dictionary from "./Dictionary";
import Progress from "./Progress";
import Profile from "./Profile";
import AITeacher from "./AITeacher";

type Page = "home" | "dialogs" | "lessons" | "languages" | "media" | "dictionary" | "progress" | "profile" | "teacher";

const navItems = [
  { id: "home", icon: "Home", label: "Главная" },
  { id: "teacher", icon: "GraduationCap", label: "Учитель" },
  { id: "dialogs", icon: "MessageCircle", label: "Диалоги" },
  { id: "lessons", icon: "BookOpen", label: "Уроки" },
  { id: "media", icon: "Sparkles", label: "Медиа" },
  { id: "dictionary", icon: "BookMarked", label: "Словарь" },
  { id: "progress", icon: "TrendingUp", label: "Прогресс" },
  { id: "profile", icon: "User", label: "Профиль" },
] as const;

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [selectedLanguage, setSelectedLanguage] = useState("Английский");

  const navigate = (p: string) => setPage(p as Page);

  const renderPage = () => {
    switch (page) {
      case "home": return <Home onNavigate={navigate} selectedLanguage={selectedLanguage} />;
      case "teacher": return <AITeacher selectedLanguage={selectedLanguage} />;
      case "dialogs": return <Dialogs selectedLanguage={selectedLanguage} />;
      case "lessons": return <Lessons selectedLanguage={selectedLanguage} />;
      case "languages": return <Languages selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
      case "media": return <Media />;
      case "dictionary": return <Dictionary />;
      case "progress": return <Progress selectedLanguage={selectedLanguage} />;
      case "profile": return <Profile selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
      default: return <Home onNavigate={navigate} selectedLanguage={selectedLanguage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-sm">🌍</span>
            </div>
            <span className="font-display font-bold text-white text-base">LinguaAI</span>
          </button>

          <button
            onClick={() => setPage("languages")}
            className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors">
            <span className="text-sm">🇬🇧</span>
            <span className="font-body text-xs text-white">{selectedLanguage}</span>
            <Icon name="ChevronDown" size={12} className="text-muted-foreground" />
          </button>

          <button onClick={() => setPage("profile")}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm">
            🧑‍🚀
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20">
        {renderPage()}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/8">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {navItems.map(item => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-300 min-w-0 ${
                    active ? "text-white" : "text-muted-foreground hover:text-white/70"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    active
                      ? item.id === "teacher"
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"
                        : "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg"
                      : ""
                  }`}>
                    <Icon name={item.icon as "Home"} size={active ? 18 : 17} className={active ? "text-white" : ""} />
                  </div>
                  <span className={`text-[10px] font-body leading-none truncate max-w-[48px] text-center ${active ? "text-white font-medium" : ""}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
