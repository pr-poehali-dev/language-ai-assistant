import { useState } from "react";
import Icon from "@/components/ui/icon";

type MediaTab = "image" | "video";

const examplePrompts = [
  { text: "Утренний Токио в дожде, неоновые вывески", type: "image" as MediaTab },
  { text: "Кафе в Париже, двое за беседой", type: "image" as MediaTab },
  { text: "Урок испанского на пляже", type: "video" as MediaTab },
  { text: "Закат над горами Исландии", type: "image" as MediaTab },
  { text: "Диалог в немецком супермаркете", type: "video" as MediaTab },
  { text: "Итальянская пиццерия, шумная атмосфера", type: "image" as MediaTab },
];

const gallery = [
  { id: 1, type: "image" as MediaTab, prompt: "Пляж в Испании, золотой закат", emoji: "🌅" },
  { id: 2, type: "video" as MediaTab, prompt: "Диалог: В кафе по-французски", emoji: "🎬" },
  { id: 3, type: "image" as MediaTab, prompt: "Улицы Токио, сакура", emoji: "🌸" },
  { id: 4, type: "image" as MediaTab, prompt: "Рынок в Марокко, яркие краски", emoji: "🏪" },
];

export default function Media() {
  const [activeTab, setActiveTab] = useState<MediaTab>("image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const handleVoice = () => {
    setIsListening(v => !v);
    if (!isListening) {
      setTimeout(() => {
        setPrompt("Закат над горами Исландии, северное сияние");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">ИИ Медиастудия</h1>
          <p className="text-muted-foreground font-body text-sm">
            Генерируй изображения и видео по тексту или голосу
          </p>
        </div>

        {/* Tabs */}
        <div className="animate-fade-in glass rounded-2xl p-1 flex gap-1" style={{ animationDelay: "0.1s" }}>
          {(["image", "video"] as MediaTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setGenerated(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Icon name={tab === "image" ? "Image" : "Video"} size={16} />
              {tab === "image" ? "Изображение" : "Видео"}
            </button>
          ))}
        </div>

        {/* Prompt input */}
        <div className="animate-fade-in space-y-3" style={{ animationDelay: "0.15s" }}>
          <div className="glass-strong rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={`Опиши ${activeTab === "image" ? "изображение" : "видео"}, которое хочешь создать...`}
                  rows={3}
                  className="w-full bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <button
                onClick={handleVoice}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-body text-xs font-medium transition-all duration-300 ${
                  isListening
                    ? "bg-red-500/20 border border-red-500/50 text-red-400 glow-pink"
                    : "glass text-muted-foreground hover:text-white"
                }`}
              >
                <Icon name={isListening ? "MicOff" : "Mic"} size={14} />
                {isListening ? "Слушаю..." : "Голос"}
                {isListening && <span className="w-1.5 h-1.5 rounded-full bg-red-400 pulse-dot" />}
              </button>
              <span className="text-xs text-muted-foreground flex-1">или выбери пример ↓</span>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs text-white transition-all duration-300 ${
                  prompt.trim() && !isGenerating
                    ? "btn-primary-grad"
                    : "bg-white/10 text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Создаю...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={14} />
                    Создать
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2">
            {examplePrompts.filter(e => e.type === activeTab).map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex.text)}
                className="glass text-xs font-body text-muted-foreground hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/10"
              >
                {ex.text}
              </button>
            ))}
          </div>
        </div>

        {/* Generation result */}
        {isGenerating && (
          <div className="animate-fade-in glass-strong rounded-3xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-400/40 border-t-purple-400 rounded-full animate-spin" />
            </div>
            <p className="font-display font-semibold text-white mb-1">
              {activeTab === "image" ? "Рисую картину" : "Создаю видео"}...
            </p>
            <p className="text-sm text-muted-foreground font-body">ИИ обрабатывает твой запрос</p>
            <div className="mt-4 flex gap-1 justify-center">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-purple-400/40"
                  style={{ animation: `pulse-dot 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {generated && !isGenerating && (
          <div className="animate-scale-in glass-strong rounded-3xl overflow-hidden">
            <div className={`relative ${activeTab === "image" ? "h-64 md:h-80" : "h-48"} bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-cyan-900/50 flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-6xl mb-3">{activeTab === "image" ? "🖼️" : "🎬"}</div>
                <p className="text-white/60 font-body text-sm">Сгенерированный {activeTab === "image" ? "контент" : "видеоролик"}</p>
                <p className="text-white/40 font-body text-xs mt-1">"{prompt}"</p>
              </div>
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-body text-sm text-white font-medium truncate">{prompt}</p>
                <p className="text-xs text-muted-foreground font-body">
                  {activeTab === "image" ? "PNG · 1024×1024" : "MP4 · 10 сек · HD"} · только что
                </p>
              </div>
              <button className="glass rounded-xl p-2 text-neon-cyan hover:bg-white/10 transition-colors">
                <Icon name="Download" size={18} />
              </button>
              <button className="glass rounded-xl p-2 text-muted-foreground hover:text-white transition-colors">
                <Icon name="Share2" size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-3">Ранее созданное</h2>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map(item => (
              <div key={item.id} className="glass rounded-2xl overflow-hidden card-hover group">
                <div className="h-28 bg-gradient-to-br from-purple-900/40 via-indigo-900/20 to-cyan-900/40 flex items-center justify-center relative">
                  <span className="text-4xl">{item.emoji}</span>
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                        <Icon name="Play" size={14} className="text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-body text-white truncate">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{item.type === "image" ? "Изображение" : "Видео"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
