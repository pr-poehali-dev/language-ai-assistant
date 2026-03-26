import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/796aca88-7e76-4ddd-abcc-8ed773198431";

type MediaTab = "image" | "video";

type GalleryItem = {
  id: number;
  type: MediaTab;
  prompt: string;
  url?: string;
  emoji?: string;
};

const examplePrompts = [
  { text: "Утренний Токио в дожде, неоновые вывески", type: "image" as MediaTab },
  { text: "Кафе в Париже, двое за беседой", type: "image" as MediaTab },
  { text: "Закат над горами Исландии, северное сияние", type: "image" as MediaTab },
  { text: "Итальянская пиццерия, шумная атмосфера", type: "image" as MediaTab },
  { text: "Урок испанского на пляже", type: "video" as MediaTab },
  { text: "Диалог в немецком супермаркете", type: "video" as MediaTab },
];

const GENERATION_STEPS = [
  "Анализирую описание...",
  "Создаю композицию...",
  "Прорисовываю детали...",
  "Финальная обработка...",
];

export default function Media() {
  const [activeTab, setActiveTab] = useState<MediaTab>("image");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [gallery, setGallery] = useState<GalleryItem[]>([
    { id: 1, type: "image", prompt: "Пляж в Испании, золотой закат", emoji: "🌅" },
    { id: 2, type: "video", prompt: "Диалог: В кафе по-французски", emoji: "🎬" },
    { id: 3, type: "image", prompt: "Улицы Токио, сакура", emoji: "🌸" },
    { id: 4, type: "image", prompt: "Рынок в Марокко, яркие краски", emoji: "🏪" },
  ]);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startStepAnimation = () => {
    setStepIndex(0);
    let i = 0;
    stepTimerRef.current = setInterval(() => {
      i += 1;
      if (i < GENERATION_STEPS.length) setStepIndex(i);
      else {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      }
    }, 1100);
  };

  const stopStepAnimation = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedUrl(null);
    setError(null);
    startStepAnimation();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Ошибка генерации");

      setGeneratedUrl(data.url);
      setGeneratedPrompt(prompt.trim());
      setGallery(prev => [
        { id: Date.now(), type: "image", prompt: prompt.trim(), url: data.url },
        ...prev.slice(0, 5),
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      stopStepAnimation();
      setIsGenerating(false);
    }
  };

  const handleVoice = () => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setPrompt("Закат над горами Исландии, северное сияние");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      setPrompt(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">ИИ Медиастудия</h1>
          <p className="text-muted-foreground font-body text-sm">
            Генерируй изображения по тексту или голосу — реально, за 5 секунд
          </p>
        </div>

        {/* Tabs */}
        <div className="animate-fade-in glass rounded-2xl p-1 flex gap-1" style={{ animationDelay: "0.1s" }}>
          {(["image", "video"] as MediaTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setGeneratedUrl(null); setError(null); }}
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
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
              placeholder={`Опиши ${activeTab === "image" ? "изображение" : "видео"}, которое хочешь создать...`}
              rows={3}
              className="w-full bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground resize-none"
            />
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

        {/* Generating state */}
        {isGenerating && (
          <div className="animate-fade-in glass-strong rounded-3xl p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="Sparkles" size={18} className="text-purple-400/60" />
              </div>
            </div>

            <p className="font-display font-semibold text-white text-base mb-1">
              {activeTab === "image" ? "Рисую картину" : "Создаю видео"}...
            </p>
            <p className="text-sm text-neon-cyan font-body mb-4 transition-all duration-500">
              {GENERATION_STEPS[stepIndex]}
            </p>

            {/* Progress bar */}
            <div className="w-full max-w-xs mx-auto h-1.5 glass rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${((stepIndex + 1) / GENERATION_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground font-body mt-3">~5 секунд</p>
          </div>
        )}

        {/* Error */}
        {error && !isGenerating && (
          <div className="animate-fade-in glass rounded-2xl p-4 border border-red-500/30">
            <div className="flex items-center gap-3">
              <Icon name="AlertCircle" size={18} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="font-body text-sm text-white font-medium">Не удалось создать</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto text-muted-foreground hover:text-white">
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Generated image result */}
        {generatedUrl && !isGenerating && (
          <div className="animate-scale-in glass-strong rounded-3xl overflow-hidden">
            <div className="relative">
              <img
                src={generatedUrl}
                alt={generatedPrompt}
                className="w-full object-cover rounded-t-3xl"
                style={{ maxHeight: "420px" }}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <a
                  href={generatedUrl}
                  download="lingua-ai-image.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="glass rounded-xl p-2 text-white hover:bg-white/20 transition-colors"
                >
                  <Icon name="Download" size={18} />
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedUrl)}
                  className="glass rounded-xl p-2 text-neon-cyan hover:bg-white/20 transition-colors"
                >
                  <Icon name="Copy" size={18} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-16">
                <div className="glass rounded-xl px-3 py-2 inline-block max-w-full">
                  <p className="text-xs text-white font-body truncate">"{generatedPrompt}"</p>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-body text-sm text-white font-medium truncate">{generatedPrompt}</p>
                <p className="text-xs text-muted-foreground font-body">JPEG · только что · FLUX Schnell</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <Icon name="CheckCircle" size={14} />
                <span className="text-xs font-body">Готово</span>
              </div>
            </div>
          </div>
        )}

        {/* Video stub */}
        {activeTab === "video" && !isGenerating && (
          <div className="animate-fade-in glass rounded-2xl p-4 border border-amber-400/20">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={16} className="text-amber-400 flex-shrink-0" />
              <p className="text-xs text-muted-foreground font-body">
                Генерация видео скоро будет доступна. Пока попробуй создать изображение!
              </p>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-3">Галерея</h2>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map(item => (
              <div key={item.id} className="glass rounded-2xl overflow-hidden card-hover group">
                <div className="h-32 bg-gradient-to-br from-purple-900/40 via-indigo-900/20 to-cyan-900/40 flex items-center justify-center relative overflow-hidden">
                  {item.url ? (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{item.emoji}</span>
                  )}
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
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {item.type === "image" ? "Изображение" : "Видео"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
