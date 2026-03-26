import { useState } from "react";
import Icon from "@/components/ui/icon";

const levels = [
  { id: "A1", label: "Начинающий", color: "from-green-500 to-emerald-600", desc: "Базовые фразы и слова" },
  { id: "A2", label: "Элементарный", color: "from-teal-500 to-cyan-600", desc: "Простые предложения" },
  { id: "B1", label: "Средний", color: "from-blue-500 to-indigo-600", desc: "Свободное общение" },
  { id: "B2", label: "Выше среднего", color: "from-violet-500 to-purple-600", desc: "Сложные темы" },
  { id: "C1", label: "Продвинутый", color: "from-pink-500 to-rose-600", desc: "Почти как носитель" },
];

const lessons = [
  { id: 1, level: "A1", title: "Приветствия", type: "vocab", icon: "Hand", xp: 15, done: true, questions: [
    { q: "Как будет 'Hello'?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], correct: 0 },
    { q: "Как спросить 'Как дела?'", options: ["How old are you?", "How are you?", "Who are you?", "Where are you?"], correct: 1 },
  ]},
  { id: 2, level: "A1", title: "Числа 1-20", type: "vocab", icon: "Hash", xp: 20, done: true, questions: [
    { q: "Что означает 'fifteen'?", options: ["13", "14", "15", "16"], correct: 2 },
    { q: "Как написать 7?", options: ["six", "seven", "eight", "nine"], correct: 1 },
  ]},
  { id: 3, level: "A2", title: "Глагол to be", type: "grammar", icon: "AlignLeft", xp: 25, done: false, questions: [
    { q: "Выберите правильную форму: I ___ a student.", options: ["am", "is", "are", "be"], correct: 0 },
    { q: "She ___ from London.", options: ["am", "is", "are", "were"], correct: 1 },
  ]},
  { id: 4, level: "B1", title: "Прошедшее время", type: "grammar", icon: "Clock", xp: 40, done: false, questions: [
    { q: "Прошедшее от 'go':", options: ["goed", "gone", "went", "goes"], correct: 2 },
    { q: "Yesterday she ___ to the store.", options: ["go", "goes", "went", "going"], correct: 2 },
  ]},
  { id: 5, level: "A2", title: "Еда и напитки", type: "vocab", icon: "Coffee", xp: 20, done: false, questions: [
    { q: "Что значит 'bread'?", options: ["Молоко", "Хлеб", "Масло", "Яйцо"], correct: 1 },
    { q: "Как по-английски 'вода'?", options: ["Juice", "Milk", "Water", "Tea"], correct: 2 },
  ]},
  { id: 6, level: "B2", title: "Идиомы", type: "speaking", icon: "Zap", xp: 60, done: false, questions: [
    { q: "'It's raining cats and dogs' означает:", options: ["Много животных", "Сильный дождь", "Плохая погода", "Шторм"], correct: 1 },
    { q: "'Break a leg' означает:", options: ["Сломать ногу", "Удачи!", "Беги быстро!", "Упади"], correct: 1 },
  ]},
];

const typeLabels: Record<string, { label: string; color: string }> = {
  vocab: { label: "Словарь", color: "text-neon-cyan" },
  grammar: { label: "Грамматика", color: "text-neon-purple" },
  speaking: { label: "Речь", color: "text-neon-pink" },
};

interface LessonsProps {
  selectedLanguage: string;
}

export default function Lessons({ selectedLanguage }: LessonsProps) {
  const [activeLevel, setActiveLevel] = useState("all");
  const [activeLesson, setActiveLesson] = useState<typeof lessons[0] | null>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const filtered = activeLevel === "all" ? lessons : lessons.filter(l => l.level === activeLevel);

  const startLesson = (lesson: typeof lessons[0]) => {
    setActiveLesson(lesson);
    setStep(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (activeLesson && idx === activeLesson.questions[step].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (!activeLesson) return;
    if (step < activeLesson.questions.length - 1) {
      setStep(s => s + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  if (activeLesson) {
    if (finished) {
      const total = activeLesson.questions.length;
      const pct = Math.round((score / total) * 100);
      return (
        <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
          <div className="animate-scale-in glass-strong rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
            <h2 className="font-display font-bold text-white text-2xl mb-2">
              {pct >= 80 ? "Отлично!" : pct >= 50 ? "Хорошо!" : "Продолжай!"}
            </h2>
            <p className="text-muted-foreground font-body mb-6">
              {score} из {total} правильных ответов
            </p>
            <div className="glass rounded-2xl p-4 mb-6">
              <div className="font-display text-4xl font-bold gradient-text mb-1">+{Math.round(activeLesson.xp * (score / total))} XP</div>
              <div className="text-xs text-muted-foreground">заработано опыта</div>
            </div>
            <button
              onClick={() => setActiveLesson(null)}
              className="btn-primary-grad w-full py-3 rounded-2xl text-white font-display font-semibold text-sm">
              Вернуться к урокам
            </button>
          </div>
        </div>
      );
    }

    const q = activeLesson.questions[step];
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="max-w-xl mx-auto w-full flex-1 px-4 py-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setActiveLesson(null)}
              className="glass rounded-xl p-2 hover:bg-white/10 transition-colors">
              <Icon name="ArrowLeft" size={20} className="text-white" />
            </button>
            <div className="flex-1 h-2 glass rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / activeLesson.questions.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-body">{step + 1}/{activeLesson.questions.length}</span>
          </div>

          <div className="animate-scale-in glass-strong rounded-3xl p-6 mb-4 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-xs text-neon-cyan font-body mb-4 font-medium uppercase tracking-wider">Выбери правильный ответ</p>
              <h2 className="font-display font-bold text-white text-xl mb-6 leading-relaxed">{q.q}</h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let cls = "glass rounded-2xl p-4 w-full text-left font-body text-sm text-white transition-all duration-300 ";
                  if (answered) {
                    if (idx === q.correct) cls += "bg-emerald-500/20 border border-emerald-500/50 glow-green";
                    else if (idx === selected) cls += "bg-red-500/20 border border-red-500/50";
                    else cls += "opacity-40";
                  } else {
                    cls += "hover:bg-white/10 hover:border-white/20 cursor-pointer";
                  }
                  return (
                    <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full glass-strong flex items-center justify-center text-xs font-display font-bold flex-shrink-0">
                          {["A", "B", "C", "D"][idx]}
                        </span>
                        {opt}
                        {answered && idx === q.correct && <Icon name="Check" size={16} className="ml-auto text-emerald-400" />}
                        {answered && idx === selected && idx !== q.correct && <Icon name="X" size={16} className="ml-auto text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {answered && (
              <button onClick={handleNext}
                className="animate-fade-in btn-primary-grad mt-6 w-full py-3 rounded-2xl text-white font-display font-semibold text-sm">
                {step < activeLesson.questions.length - 1 ? "Следующий вопрос →" : "Завершить урок 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Уроки</h1>
          <p className="text-muted-foreground font-body text-sm">
            Адаптивные задания · {selectedLanguage} · Уровень: B1
          </p>
        </div>

        {/* Adaptive level indicator */}
        <div className="animate-fade-in glass rounded-2xl p-4 flex items-center gap-4" style={{ animationDelay: "0.1s" }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-body font-medium text-white text-sm">Адаптивная система</p>
            <p className="text-xs text-muted-foreground font-body">ИИ подбирает сложность в реальном времени</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs text-emerald-400 font-body">Активно</span>
          </div>
        </div>

        {/* Level filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <button
            onClick={() => setActiveLevel("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
              activeLevel === "all" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "glass text-muted-foreground hover:text-white"
            }`}
          >
            Все уровни
          </button>
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                activeLevel === l.id ? `bg-gradient-to-r ${l.color} text-white` : "glass text-muted-foreground hover:text-white"
              }`}
            >
              {l.id}
            </button>
          ))}
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => startLesson(lesson)}
              className="animate-fade-in glass rounded-2xl p-5 text-left card-hover group"
              style={{ animationDelay: `${0.2 + i * 0.06}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                  <Icon name={lesson.icon as "Hash"} fallback="BookOpen" size={22} className="text-neon-cyan" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-display font-bold text-white glass px-2 py-0.5 rounded-full">
                    {lesson.level}
                  </span>
                  {lesson.done && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-body">
                      <Icon name="CheckCircle" size={10} />
                      пройден
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-1">{lesson.title}</h3>
              <div className="flex items-center gap-3 text-xs font-body">
                <span className={typeLabels[lesson.type]?.color ?? "text-muted-foreground"}>
                  {typeLabels[lesson.type]?.label}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{lesson.questions.length} вопроса</span>
                <span className="ml-auto text-neon-cyan">+{lesson.xp} XP</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
