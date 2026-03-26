import { useState } from "react";
import Icon from "@/components/ui/icon";

const words = [
  { id: 1, word: "Beautiful", tr: "Красивый", example: "She has a beautiful smile.", learned: true, starred: true, lang: "en" },
  { id: 2, word: "Adventure", tr: "Приключение", example: "Every day is a new adventure.", learned: true, starred: false, lang: "en" },
  { id: 3, word: "Serendipity", tr: "Случайная удача", example: "Finding this café was pure serendipity.", learned: false, starred: true, lang: "en" },
  { id: 4, word: "Ephemeral", tr: "Мимолётный", example: "Beauty is ephemeral.", learned: false, starred: false, lang: "en" },
  { id: 5, word: "Hola", tr: "Привет", example: "¡Hola! ¿Cómo estás?", learned: true, starred: false, lang: "es" },
  { id: 6, word: "Amor", tr: "Любовь", example: "El amor es eterno.", learned: true, starred: true, lang: "es" },
  { id: 7, word: "桜 (sakura)", tr: "Сакура", example: "桜が綺麗ですね。", learned: false, starred: true, lang: "ja" },
  { id: 8, word: "Merci", tr: "Спасибо", example: "Merci beaucoup!", learned: true, starred: false, lang: "fr" },
];

type Filter = "all" | "learned" | "new" | "starred";

export default function Dictionary() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<number | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);

  const filtered = words.filter(w => {
    const matchSearch = w.word.toLowerCase().includes(search.toLowerCase()) || w.tr.toLowerCase().includes(search.toLowerCase());
    if (filter === "learned") return matchSearch && w.learned;
    if (filter === "new") return matchSearch && !w.learned;
    if (filter === "starred") return matchSearch && w.starred;
    return matchSearch;
  });

  const learnedCount = words.filter(w => w.learned).length;

  if (quizMode) {
    const w = filtered[quizIndex % filtered.length];
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setQuizMode(false)} className="glass rounded-xl p-2">
              <Icon name="ArrowLeft" size={20} className="text-white" />
            </button>
            <span className="font-display text-white font-semibold">Повторение</span>
            <span className="ml-auto text-xs text-muted-foreground font-body">{quizIndex + 1}/{filtered.length}</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full">
              <div
                onClick={() => setQuizRevealed(true)}
                className="glass-strong rounded-3xl p-10 text-center cursor-pointer card-hover mb-4 min-h-48 flex flex-col items-center justify-center"
                style={{ boxShadow: quizRevealed ? "0 0 40px rgba(168,85,247,0.2)" : "none" }}>
                <p className="font-display font-bold text-white text-3xl mb-3">{w?.word}</p>
                {!quizRevealed && (
                  <p className="text-muted-foreground font-body text-sm">Нажми, чтобы увидеть перевод</p>
                )}
                {quizRevealed && (
                  <div className="animate-fade-in text-center">
                    <p className="text-neon-cyan font-body text-xl font-medium mb-2">{w?.tr}</p>
                    <p className="text-muted-foreground font-body text-sm italic">"{w?.example}"</p>
                  </div>
                )}
              </div>

              {quizRevealed && (
                <div className="animate-fade-in flex gap-3">
                  <button onClick={() => { setQuizIndex(i => i + 1); setQuizRevealed(false); }}
                    className="flex-1 glass rounded-2xl py-3 text-red-400 font-body text-sm font-medium flex items-center justify-center gap-2">
                    <Icon name="X" size={16} /> Не знал
                  </button>
                  <button onClick={() => { setQuizIndex(i => i + 1); setQuizRevealed(false); }}
                    className="flex-1 btn-primary-grad rounded-2xl py-3 text-white font-body text-sm font-medium flex items-center justify-center gap-2">
                    <Icon name="Check" size={16} /> Знал!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-white text-2xl mb-1">Мой словарь</h1>
            <p className="text-muted-foreground font-body text-sm">{learnedCount} из {words.length} слов изучено</p>
          </div>
          <button onClick={() => setQuizMode(true)}
            className="btn-primary-grad px-4 py-2 rounded-xl text-white font-body text-sm font-medium flex items-center gap-2">
            <Icon name="Zap" size={14} />
            Повторить
          </button>
        </div>

        {/* Search */}
        <div className="animate-fade-in glass rounded-2xl flex items-center gap-3 px-4 py-3" style={{ animationDelay: "0.1s" }}>
          <Icon name="Search" size={18} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Найти слово..." className="flex-1 bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto animate-fade-in" style={{ animationDelay: "0.12s" }}>
          {([
            { id: "all", label: "Все", count: words.length },
            { id: "new", label: "Новые", count: words.filter(w => !w.learned).length },
            { id: "learned", label: "Изучены", count: learnedCount },
            { id: "starred", label: "Избранные", count: words.filter(w => w.starred).length },
          ] as { id: Filter; label: string; count: number }[]).map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                filter === f.id ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "glass text-muted-foreground hover:text-white"
              }`}>
              {f.label}
              <span className="text-xs opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Words list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((w, i) => (
            <div key={w.id}
              onClick={() => setFlipped(flipped === w.id ? null : w.id)}
              className="animate-fade-in glass rounded-2xl p-4 cursor-pointer card-hover"
              style={{ animationDelay: `${0.15 + i * 0.04}s` }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display font-semibold text-white text-base">{w.word}</p>
                  <p className="text-sm text-neon-cyan font-body">{w.tr}</p>
                </div>
                <div className="flex items-center gap-2">
                  {w.starred && <Icon name="Star" size={14} className="text-amber-400" />}
                  {w.learned
                    ? <span className="text-xs text-emerald-400 glass px-2 py-0.5 rounded-full font-body">Изучено</span>
                    : <span className="text-xs text-muted-foreground glass px-2 py-0.5 rounded-full font-body">Новое</span>}
                </div>
              </div>
              {flipped === w.id && (
                <div className="animate-fade-in mt-2 pt-2 border-t border-white/10">
                  <p className="text-xs text-muted-foreground font-body italic">"{w.example}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-body">
            Слова не найдены
          </div>
        )}
      </div>
    </div>
  );
}
