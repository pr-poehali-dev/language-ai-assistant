import { useState } from "react";
import Icon from "@/components/ui/icon";

const langs = ["Английский", "Испанский", "Японский", "Французский"];

interface ProfileProps {
  selectedLanguage: string;
  onLanguageChange: (l: string) => void;
}

export default function Profile({ selectedLanguage, onLanguageChange }: ProfileProps) {
  const [notif, setNotif] = useState(true);
  const [daily, setDaily] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [goal, setGoal] = useState(15);

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Avatar */}
        <div className="animate-fade-in flex flex-col items-center text-center py-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-5xl shadow-lg glow-purple">
              🧑‍🚀
            </div>
            <button className="absolute bottom-0 right-0 glass rounded-full p-1.5 border border-white/20">
              <Icon name="Camera" size={14} className="text-white" />
            </button>
          </div>
          <h2 className="font-display font-bold text-white text-xl">Александр</h2>
          <p className="text-muted-foreground font-body text-sm">Изучает языки с января 2025</p>
          <div className="flex gap-4 mt-3">
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg">1247</p>
              <p className="text-xs text-muted-foreground font-body">XP</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg">7</p>
              <p className="text-xs text-muted-foreground font-body">Серия</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="font-display font-bold text-white text-lg">{langs.length}</p>
              <p className="text-xs text-muted-foreground font-body">Языка</p>
            </div>
          </div>
        </div>

        {/* Current language */}
        <div className="animate-fade-in glass rounded-2xl p-5" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-display font-semibold text-white text-sm mb-3">Основной язык</h3>
          <div className="flex flex-wrap gap-2">
            {langs.map(l => (
              <button key={l} onClick={() => onLanguageChange(l)}
                className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                  selectedLanguage === l
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white glow-purple"
                    : "glass text-muted-foreground hover:text-white"
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Daily goal */}
        <div className="animate-fade-in glass rounded-2xl p-5" style={{ animationDelay: "0.15s" }}>
          <h3 className="font-display font-semibold text-white text-sm mb-3">Цель на день</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 glass rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(goal / 30) * 100}%` }} />
            </div>
            <span className="font-display font-bold text-white w-16 text-right">{goal} мин</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[5, 10, 15, 20, 30].map(m => (
              <button key={m} onClick={() => setGoal(m)}
                className={`flex-1 py-1.5 rounded-xl font-body text-xs transition-all ${
                  goal === m ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "glass text-muted-foreground hover:text-white"
                }`}>
                {m}м
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="animate-fade-in glass rounded-2xl overflow-hidden" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-display font-semibold text-white text-sm p-5 pb-3">Настройки</h3>
          {[
            { label: "Уведомления", desc: "Напоминания о занятиях", val: notif, set: setNotif, icon: "Bell" },
            { label: "Ежедневная цель", desc: "Напоминать о цели дня", val: daily, set: setDaily, icon: "Target" },
            { label: "Звуки", desc: "Звуки при ответах", val: sounds, set: setSounds, icon: "Volume2" },
          ].map((s, i) => (
            <div key={s.label} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-white/10" : ""}`}>
              <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <Icon name={s.icon as "Bell"} size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm text-white">{s.label}</p>
                <p className="text-xs text-muted-foreground font-body">{s.desc}</p>
              </div>
              <button onClick={() => s.set((v: boolean) => !v)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${s.val ? "bg-gradient-to-r from-purple-500 to-cyan-500" : "bg-white/20"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${s.val ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <button className="w-full glass rounded-2xl py-3.5 text-red-400 font-body text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors">
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>

      </div>
    </div>
  );
}
