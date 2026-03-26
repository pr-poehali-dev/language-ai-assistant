import { useState } from "react";
import Icon from "@/components/ui/icon";

const categories = [
  { id: "all", label: "Все", emoji: "🌍" },
  { id: "cafe", label: "Кафе", emoji: "☕" },
  { id: "travel", label: "Путешествия", emoji: "✈️" },
  { id: "work", label: "Работа", emoji: "💼" },
  { id: "shopping", label: "Магазин", emoji: "🛍️" },
  { id: "health", label: "Здоровье", emoji: "🏥" },
  { id: "social", label: "Общение", emoji: "🤝" },
];

const dialogs = [
  {
    id: 1, category: "cafe", level: "A1", title: "В кафе",
    desc: "Заказываем кофе и завтрак",
    emoji: "☕", duration: "5 мин", xp: 20,
    lines: [
      { role: "en", text: "Good morning! Can I have a coffee, please?", tr: "Доброе утро! Можно мне кофе?" },
      { role: "user", text: "Sure! What kind of coffee?", tr: "Конечно! Какой кофе?" },
      { role: "en", text: "A cappuccino, please. And a croissant.", tr: "Капучино, пожалуйста. И круассан." },
    ]
  },
  {
    id: 2, category: "travel", level: "A2", title: "В аэропорту",
    desc: "Регистрация на рейс и досмотр",
    emoji: "✈️", duration: "7 мин", xp: 30,
    lines: [
      { role: "en", text: "Excuse me, where is the check-in desk?", tr: "Извините, где стойка регистрации?" },
      { role: "user", text: "It's on the second floor, gate B.", tr: "Она на втором этаже, выход B." },
    ]
  },
  {
    id: 3, category: "work", level: "B1", title: "На собеседовании",
    desc: "Рассказываем о себе и опыте",
    emoji: "💼", duration: "10 мин", xp: 50,
    lines: [
      { role: "en", text: "Tell me about your professional experience.", tr: "Расскажите о вашем опыте работы." },
      { role: "user", text: "I have 5 years in software development.", tr: "У меня 5 лет в разработке." },
    ]
  },
  {
    id: 4, category: "shopping", level: "A1", title: "В магазине",
    desc: "Покупаем одежду и спрашиваем размер",
    emoji: "🛍️", duration: "6 мин", xp: 25,
    lines: [
      { role: "en", text: "Do you have this shirt in a larger size?", tr: "Есть ли эта рубашка большего размера?" },
      { role: "user", text: "Let me check for you!", tr: "Сейчас проверю для вас!" },
    ]
  },
  {
    id: 5, category: "social", level: "A2", title: "Знакомство",
    desc: "Представляемся и узнаём друг друга",
    emoji: "🤝", duration: "5 мин", xp: 20,
    lines: [
      { role: "en", text: "Hi! I'm Alex. Nice to meet you!", tr: "Привет! Я Алекс. Приятно познакомиться!" },
      { role: "user", text: "Nice to meet you too! I'm from Moscow.", tr: "Тоже приятно! Я из Москвы." },
    ]
  },
  {
    id: 6, category: "health", level: "B1", title: "У врача",
    desc: "Описываем симптомы и получаем рекомендации",
    emoji: "🏥", duration: "8 мин", xp: 40,
    lines: [
      { role: "en", text: "I've had a headache for two days.", tr: "У меня болит голова уже два дня." },
      { role: "user", text: "I'll prescribe some medication for you.", tr: "Я выпишу вам лекарство." },
    ]
  },
];

const levelColors: Record<string, string> = {
  A1: "from-green-500 to-emerald-600",
  A2: "from-teal-500 to-cyan-600",
  B1: "from-blue-500 to-indigo-600",
  B2: "from-violet-500 to-purple-600",
  C1: "from-pink-500 to-rose-600",
};

interface DialogsProps {
  selectedLanguage: string;
}

export default function Dialogs({ selectedLanguage }: DialogsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDialog, setActiveDialog] = useState<typeof dialogs[0] | null>(null);
  const [chatStep, setChatStep] = useState(0);
  const [userInput, setUserInput] = useState("");

  const filtered = activeCategory === "all"
    ? dialogs
    : dialogs.filter(d => d.category === activeCategory);

  if (activeDialog) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setActiveDialog(null); setChatStep(0); }}
              className="glass rounded-xl p-2 hover:bg-white/10 transition-colors">
              <Icon name="ArrowLeft" size={20} className="text-white" />
            </button>
            <div className="flex-1">
              <h2 className="font-display font-semibold text-white">{activeDialog.title}</h2>
              <p className="text-xs text-muted-foreground font-body">{selectedLanguage} · {activeDialog.level}</p>
            </div>
            <span className="text-2xl">{activeDialog.emoji}</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
            {activeDialog.lines.slice(0, chatStep + 1).map((line, i) => (
              <div key={i}
                className={`animate-fade-in flex ${line.role === "user" ? "justify-end" : "justify-start"}`}>
                {line.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mr-2 flex-shrink-0 text-sm">
                    🤖
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  line.role === "user"
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
                    : "glass text-white"
                }`}>
                  <p className="font-body text-sm">{line.text}</p>
                  <p className="text-xs mt-1 opacity-60 font-body italic">{line.tr}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="glass-strong rounded-2xl p-3 flex gap-3 items-center">
            <button className="glass rounded-xl p-2 text-neon-cyan">
              <Icon name="Mic" size={20} />
            </button>
            <input
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Напишите ответ..."
              className="flex-1 bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={e => {
                if (e.key === "Enter" && chatStep < activeDialog.lines.length - 1) {
                  setChatStep(s => s + 1);
                  setUserInput("");
                }
              }}
            />
            <button
              onClick={() => {
                if (chatStep < activeDialog.lines.length - 1) {
                  setChatStep(s => s + 1);
                  setUserInput("");
                }
              }}
              className="btn-primary-grad rounded-xl p-2 text-white">
              <Icon name="Send" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">
            Диалоги для практики
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Реальные разговорные ситуации на {selectedLanguage}
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg glow-purple"
                  : "glass text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Dialogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dialog, i) => (
            <button
              key={dialog.id}
              onClick={() => { setActiveDialog(dialog); setChatStep(0); }}
              className="animate-fade-in glass rounded-2xl p-5 text-left card-hover group"
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{dialog.emoji}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-display font-bold text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${levelColors[dialog.level] ?? "from-gray-500 to-gray-600"}`}>
                    {dialog.level}
                  </span>
                  <span className="text-xs text-neon-cyan font-body">+{dialog.xp} XP</span>
                </div>
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-1">{dialog.title}</h3>
              <p className="text-sm text-muted-foreground font-body mb-3">{dialog.desc}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  {dialog.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MessageSquare" size={12} />
                  {dialog.lines.length} реплики
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
