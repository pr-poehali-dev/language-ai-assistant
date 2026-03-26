import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface HomeProps {
  onNavigate: (page: string) => void;
  selectedLanguage: string;
}

const stats = [
  { label: "Языков", value: "50+", icon: "Globe" },
  { label: "Уроков", value: "1200+", icon: "BookOpen" },
  { label: "Учеников", value: "500K+", icon: "Users" },
  { label: "Диалогов", value: "300+", icon: "MessageCircle" },
];

const features = [
  {
    icon: "MessageCircle",
    title: "Диалоги",
    desc: "Практика реальных разговорных ситуаций",
    color: "from-purple-500 to-indigo-600",
    glow: "glow-purple",
    page: "dialogs",
  },
  {
    icon: "BookOpen",
    title: "Уроки",
    desc: "Адаптивные задания под ваш уровень",
    color: "from-cyan-500 to-blue-600",
    glow: "glow-cyan",
    page: "lessons",
  },
  {
    icon: "Globe",
    title: "50 языков",
    desc: "Выбери свой язык и начни прямо сейчас",
    color: "from-emerald-500 to-teal-600",
    glow: "glow-green",
    page: "languages",
  },
  {
    icon: "Sparkles",
    title: "ИИ Медиа",
    desc: "Генерация изображений и видео",
    color: "from-pink-500 to-rose-600",
    glow: "glow-pink",
    page: "media",
  },
  {
    icon: "BookMarked",
    title: "Словарь",
    desc: "Личная коллекция слов и фраз",
    color: "from-amber-500 to-orange-600",
    glow: "",
    page: "dictionary",
  },
  {
    icon: "TrendingUp",
    title: "Прогресс",
    desc: "Статистика и достижения",
    color: "from-violet-500 to-purple-600",
    glow: "glow-purple",
    page: "progress",
  },
];

const todayTasks = [
  { title: "Новые слова", count: 10, done: 4, color: "#a855f7" },
  { title: "Диалог дня", count: 1, done: 0, color: "#22d3ee" },
  { title: "Грамматика", count: 3, done: 3, color: "#10b981" },
  { title: "Аудирование", count: 2, done: 1, color: "#f59e0b" },
];

export default function Home({ onNavigate, selectedLanguage }: HomeProps) {
  const [greeting, setGreeting] = useState("Доброе утро");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting("Доброе утро");
    else if (h >= 12 && h < 17) setGreeting("Добрый день");
    else if (h >= 17 && h < 22) setGreeting("Добрый вечер");
    else setGreeting("Доброй ночи");

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const totalDone = todayTasks.reduce((a, t) => a + t.done, 0);
  const totalCount = todayTasks.reduce((a, t) => a + t.count, 0);
  const dayProgress = Math.round((totalDone / totalCount) * 100);

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Hero Header */}
        <div className="animate-fade-in relative overflow-hidden rounded-3xl p-8 glass-strong"
          style={{ animationDelay: "0.1s" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 rounded-3xl" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-muted-foreground text-sm font-body mb-1">
                {greeting} ✨
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                Продолжай учить{" "}
                <span className="gradient-text">{selectedLanguage}</span>
              </h1>
              <p className="text-muted-foreground font-body">
                Ты на правильном пути — не останавливайся!
              </p>
            </div>

            <div className="flex flex-col items-center glass rounded-2xl p-5 min-w-[140px]">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none"
                    stroke="url(#progress-grad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - dayProgress / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <defs>
                    <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-lg">{dayProgress}%</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-body">цель дня</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={s.label}
              className="animate-fade-in glass rounded-2xl p-4 flex items-center gap-3 card-hover"
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name={s.icon as any} size={18} className="text-neon-cyan" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">{s.value}</div>
                <div className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Tasks */}
        <div className="animate-fade-in glass rounded-3xl p-6" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">
              Задачи на сегодня
            </h2>
            <span className="text-xs glass rounded-full px-3 py-1 text-muted-foreground font-body">
              {totalDone}/{totalCount} выполнено
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayTasks.map((task) => {
              const p = Math.round((task.done / task.count) * 100);
              return (
                <div key={task.title} className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body font-medium text-white text-sm">{task.title}</span>
                    <span className="text-xs text-muted-foreground font-body">{task.done}/{task.count}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${p}%`,
                        background: `linear-gradient(90deg, ${task.color}99, ${task.color})`,
                        boxShadow: `0 0 10px ${task.color}66`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="font-display font-semibold text-white text-xl mb-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}>
            Разделы приложения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.page)}
                className={`animate-fade-in glass rounded-2xl p-5 text-left card-hover group cursor-pointer ${f.glow}`}
                style={{ animationDelay: `${0.45 + i * 0.06}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={f.icon as any} size={22} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Streak Banner */}
        <div className="animate-fade-in relative overflow-hidden rounded-3xl p-6 glass-strong"
          style={{ animationDelay: "0.7s" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
          <div className="relative flex items-center gap-4">
            <div className="text-5xl float">🔥</div>
            <div>
              <p className="font-display font-bold text-white text-2xl">7 дней подряд!</p>
              <p className="text-muted-foreground font-body text-sm">
                Отличная серия! Продолжай учиться каждый день
              </p>
            </div>
            <div className="ml-auto text-right hidden md:block">
              <div className="font-display text-amber-400 text-lg font-bold">+50 XP</div>
              <div className="text-xs text-muted-foreground">бонус за серию</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
