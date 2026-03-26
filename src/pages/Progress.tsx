import Icon from "@/components/ui/icon";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const weekActivity = [40, 65, 30, 80, 55, 90, 70];

const achievements = [
  { icon: "🔥", title: "7 дней подряд", desc: "Не пропускаешь ни дня", earned: true },
  { icon: "⭐", title: "Первая 1000 XP", desc: "Набрал 1000 очков опыта", earned: true },
  { icon: "🎯", title: "Меткий стрелок", desc: "100% правильных ответов в уроке", earned: true },
  { icon: "🌍", title: "Полиглот", desc: "Изучаешь 3+ языка", earned: false },
  { icon: "💬", title: "Болтун", desc: "50 завершённых диалогов", earned: false },
  { icon: "🏆", title: "Мастер слов", desc: "500 слов в словаре", earned: false },
];

const skills = [
  { label: "Словарный запас", value: 72, color: "#a855f7" },
  { label: "Грамматика", value: 58, color: "#22d3ee" },
  { label: "Аудирование", value: 45, color: "#f59e0b" },
  { label: "Разговорная речь", value: 61, color: "#10b981" },
  { label: "Чтение", value: 83, color: "#ec4899" },
];

interface ProgressProps {
  selectedLanguage: string;
}

export default function Progress({ selectedLanguage }: ProgressProps) {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Мой прогресс</h1>
          <p className="text-muted-foreground font-body text-sm">{selectedLanguage} · Уровень B1 · 1247 XP</p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { label: "Серия дней", value: "7", icon: "Flame", color: "from-orange-500 to-red-600" },
            { label: "Всего XP", value: "1247", icon: "Zap", color: "from-yellow-500 to-amber-600" },
            { label: "Слов изучено", value: "284", icon: "BookOpen", color: "from-purple-500 to-indigo-600" },
            { label: "Уроков", value: "43", icon: "GraduationCap", color: "from-cyan-500 to-blue-600" },
          ].map((s, i) => (
            <div key={s.label} className="glass rounded-2xl p-4 card-hover" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <Icon name={s.icon as "Flame"} size={18} className="text-white" />
              </div>
              <p className="font-display font-bold text-white text-2xl">{s.value}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly activity */}
        <div className="animate-fade-in glass rounded-3xl p-6" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-4">Активность за неделю</h2>
          <div className="flex items-end gap-2 h-24">
            {weekActivity.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-lg relative overflow-hidden"
                  style={{ height: `${(val / 100) * 80}px`, background: `linear-gradient(to top, #7c3aed, #22d3ee)`, opacity: val > 70 ? 1 : 0.5 }}>
                  <div className="absolute inset-0 shimmer" />
                </div>
                <span className="text-xs text-muted-foreground font-body">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="animate-fade-in glass rounded-3xl p-6" style={{ animationDelay: "0.25s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-4">Навыки</h2>
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-body text-sm text-white">{skill.label}</span>
                  <span className="font-display text-sm font-bold" style={{ color: skill.color }}>{skill.value}%</span>
                </div>
                <div className="h-2 glass rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${skill.value}%`, background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`, boxShadow: `0 0 8px ${skill.color}66` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-3">Достижения</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((a, i) => (
              <div key={a.title}
                className={`glass rounded-2xl p-4 transition-all duration-300 ${a.earned ? "border border-amber-400/20" : "opacity-50"}`}
                style={{ animationDelay: `${i * 0.04}s`, boxShadow: a.earned ? "0 0 20px rgba(251,191,36,0.1)" : "none" }}>
                <span className={`text-3xl block mb-2 ${!a.earned ? "grayscale" : ""}`}>{a.icon}</span>
                <p className="font-display font-semibold text-white text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{a.desc}</p>
                {a.earned && <div className="flex items-center gap-1 mt-2">
                  <Icon name="CheckCircle" size={11} className="text-amber-400" />
                  <span className="text-xs text-amber-400 font-body">Получено</span>
                </div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
