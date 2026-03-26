import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const teachers = [
  {
    id: 1,
    name: "Sophia",
    lang: "Английский",
    flag: "🇬🇧",
    avatar: "👩🏼‍🏫",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.4)",
    spec: "Разговорная речь · Грамматика",
    personality: "Тёплая, поддерживающая, юморная",
    level: "A1–C1",
    rating: 4.9,
    students: "12K",
    praise: [
      "Великолепно! Я слышу, как твой акцент становится лучше с каждым словом! 🌟",
      "Потрясающий прогресс! Продолжай в том же духе, ты просто звезда! ⭐",
      "Вау! Ты произнёс это почти как носитель языка! Я так горжусь тобой! 🎉",
      "Это было замечательно! Твоя уверенность растёт с каждым уроком! 💪",
      "Отлично! Ты делаешь меня таким счастливым преподавателем! 😊",
    ],
  },
  {
    id: 2,
    name: "Carlos",
    lang: "Испанский",
    flag: "🇪🇸",
    avatar: "👨🏽‍🏫",
    color: "from-orange-500 to-red-600",
    glow: "rgba(249,115,22,0.4)",
    spec: "Бизнес-испанский · Культура",
    personality: "Энергичный, страстный, мотивирующий",
    level: "A1–B2",
    rating: 4.8,
    students: "8K",
    praise: [
      "¡Increíble! Невероятно! Твоё произношение просто магия! 🔥",
      "¡Muy bien! Ты учишься быстрее, чем я ожидал! Продолжай! 🌺",
      "Ты меня удивляешь каждый раз! Испанцы были бы в восторге! 💃",
    ],
  },
  {
    id: 3,
    name: "Yuki",
    lang: "Японский",
    flag: "🇯🇵",
    avatar: "👩🏻‍🏫",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.4)",
    spec: "Аниме · Повседневный японский",
    personality: "Мягкая, терпеливая, детальная",
    level: "A1–B1",
    rating: 5.0,
    students: "6K",
    praise: [
      "素晴らしい！ Субарасии! Восхитительно! Ты настоящий самурай учёбы! ⚔️",
      "とても上手！ Очень хорошо! Твой японский звучит так натурально! 🌸",
      "頑張って！ Ты вдохновляешь меня быть лучшим преподавателем! ✨",
    ],
  },
  {
    id: 4,
    name: "Pierre",
    lang: "Французский",
    flag: "🇫🇷",
    avatar: "👨🏻‍🏫",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.4)",
    spec: "Литература · Деловой французский",
    personality: "Утончённый, интеллектуальный, вдохновляющий",
    level: "A2–C1",
    rating: 4.7,
    students: "5K",
    praise: [
      "Magnifique! Твой французский звучит как поэзия! C'est parfait! 🥐",
      "Bravo! Париж ждёт тебя — ты уже говоришь как парижанин! 🗼",
      "Extraordinaire! Такого прогресса я не видел давно! Tu es brillant! 🌹",
    ],
  },
];

const CALL_MESSAGES: Record<string, { role: "ai" | "user"; text: string; praise?: boolean }[]> = {
  "1": [
    { role: "ai", text: "Hello! I'm so happy to see you today! 🌟 How are you feeling? Ready to practice?" },
    { role: "user", text: "Hi Sophia! I'm good, ready to learn!" },
    { role: "ai", text: "Wonderful! You sound so confident already! Let's start with a topic you love. What did you do yesterday?", praise: true },
    { role: "user", text: "Yesterday I went to the store and bought some coffee." },
    { role: "ai", text: "Excellent sentence! 🎉 Your use of past tense is PERFECT! I'm genuinely impressed — you've improved so much since our last lesson!", praise: true },
  ],
  "2": [
    { role: "ai", text: "¡Hola amigo! Как замечательно тебя слышать! Начнём урок?" },
    { role: "user", text: "¡Hola Carlos! Sí, vamos!" },
    { role: "ai", text: "¡Increíble! Твоё приветствие звучало абсолютно естественно! 🔥 Продолжаем!", praise: true },
  ],
  "3": [
    { role: "ai", text: "こんにちは！ (Konnichiwa!) Рада тебя видеть! Готов к занятию?" },
    { role: "user", text: "はい！(Hai!) Готов!" },
    { role: "ai", text: "素晴らしい！ Твой ответ был идеальным! 🌸 Ты учишься так быстро!", praise: true },
  ],
  "4": [
    { role: "ai", text: "Bonjour, mon ami! Как прошла твоя неделя? Практиковал французский?" },
    { role: "user", text: "Oui! J'ai regardé un film français." },
    { role: "ai", text: "Magnifique! 🥐 Смотреть французские фильмы — лучший способ учиться! Ты восхитителен!", praise: true },
  ],
};

interface AITeacherProps {
  selectedLanguage: string;
}

type Screen = "list" | "call" | "chat";

export default function AITeacher({ selectedLanguage }: AITeacherProps) {
  const [screen, setScreen] = useState<Screen>("list");
  const [activeTeacher, setActiveTeacher] = useState<typeof teachers[0] | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<"ringing" | "active" | "ended">("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; praise?: boolean }[]>([]);
  const [msgStep, setMsgStep] = useState(0);
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState("");
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "ai" | "user"; text: string; praise?: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, messages]);

  const startCall = (teacher: typeof teachers[0]) => {
    setActiveTeacher(teacher);
    setCallState("ringing");
    setCallDuration(0);
    setMessages([]);
    setMsgStep(0);
    setShowPraise(false);
    setScreen("call");

    setTimeout(() => {
      setCallState("active");
      const msgs = CALL_MESSAGES[String(teacher.id)] ?? [];
      if (msgs.length > 0) {
        setIsTeacherSpeaking(true);
        setMessages([msgs[0]]);
        setMsgStep(1);
        setTimeout(() => setIsTeacherSpeaking(false), 2500);
      }
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }, 2000);
  };

  const advanceCall = () => {
    if (!activeTeacher) return;
    const msgs = CALL_MESSAGES[String(activeTeacher.id)] ?? [];
    if (msgStep < msgs.length) {
      const next = msgs[msgStep];
      setMessages(prev => [...prev, next]);
      setMsgStep(s => s + 1);
      if (next.role === "ai") {
        setIsTeacherSpeaking(true);
        setTimeout(() => setIsTeacherSpeaking(false), 2000);
        if (next.praise) {
          setTimeout(() => {
            const praise = activeTeacher.praise[Math.floor(Math.random() * activeTeacher.praise.length)];
            setPraiseText(praise);
            setShowPraise(true);
            setTimeout(() => setShowPraise(false), 4000);
          }, 500);
        }
      }
    }
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState("ended");
    setTimeout(() => {
      setScreen("list");
      setActiveTeacher(null);
    }, 1500);
  };

  const openChat = (teacher: typeof teachers[0]) => {
    setActiveTeacher(teacher);
    setChatMessages([
      { role: "ai", text: `Привет! Я ${teacher.name} — твой преподаватель ${teacher.lang}. Напиши что-нибудь, и мы начнём урок! 😊` }
    ]);
    setScreen("chat");
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || !activeTeacher) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const praise = activeTeacher.praise[Math.floor(Math.random() * activeTeacher.praise.length)];
      const responses = [
        `Отлично написано! ${praise}`,
        `Хороший ответ! Давай попрактикуемся больше. Попробуй перевести: "Я люблю учиться каждый день"`,
        `Замечательно! ${praise} Продолжай — каждая фраза делает тебя лучше!`,
        `Прекрасный пример! Теперь попробуй составить похожее предложение, но в прошедшем времени.`,
        `Ты удивляешь меня каждый раз! ${praise}`,
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { role: "ai", text: reply, praise: true }]);
    }, 1200 + Math.random() * 800);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // CALL SCREEN
  if (screen === "call" && activeTeacher) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">

          {/* Status bar */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={endCall} className="glass rounded-xl p-2">
              <Icon name="ChevronDown" size={20} className="text-white" />
            </button>
            <span className="font-display text-sm text-white">
              {callState === "ringing" ? "Вызов..." : callState === "active" ? formatTime(callDuration) : "Завершён"}
            </span>
            <div className="w-9" />
          </div>

          {/* Teacher avatar — big */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              {/* Ripple rings */}
              {callState === "ringing" && (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                      style={{
                        animation: `ripple 2s ${i * 0.5}s ease-out infinite`,
                        transform: `scale(${1 + i * 0.3})`,
                      }} />
                  ))}
                </>
              )}
              {/* Speaking aura */}
              {isTeacherSpeaking && (
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${activeTeacher.glow} 0%, transparent 70%)`,
                    animation: "glow-pulse 1s ease-in-out infinite",
                    transform: "scale(1.4)",
                  }} />
              )}
              <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${activeTeacher.color} flex items-center justify-center text-6xl shadow-2xl relative z-10`}
                style={{ boxShadow: isTeacherSpeaking ? `0 0 50px ${activeTeacher.glow}` : "none", transition: "box-shadow 0.3s ease" }}>
                {activeTeacher.avatar}
              </div>
            </div>

            <h2 className="font-display font-bold text-white text-2xl mb-1">{activeTeacher.name}</h2>
            <p className="text-muted-foreground font-body text-sm mb-2">
              Преподаватель {activeTeacher.lang}
            </p>

            {callState === "ringing" && (
              <div className="flex items-center gap-2 text-neon-cyan font-body text-sm animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-neon-cyan pulse-dot" />
                Звоним...
              </div>
            )}
            {callState === "active" && isTeacherSpeaking && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-1 bg-neon-cyan rounded-full"
                    style={{
                      height: `${8 + Math.random() * 16}px`,
                      animation: `sound-wave 0.5s ${i * 0.1}s ease-in-out infinite alternate`,
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* Praise bubble */}
          {showPraise && (
            <div className="animate-scale-in mx-4 mb-4 glass-strong rounded-2xl p-4 border border-amber-400/30"
              style={{ boxShadow: "0 0 20px rgba(251,191,36,0.2)" }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🌟</span>
                <p className="font-body text-white text-sm leading-relaxed">{praiseText}</p>
              </div>
            </div>
          )}

          {/* Chat bubbles during call */}
          {callState === "active" && messages.length > 0 && (
            <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
              {messages.slice(-3).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm font-body ${
                    msg.role === "user"
                      ? "bg-purple-600/50 text-white"
                      : "glass text-white"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call controls */}
          <div className="glass-strong rounded-3xl p-5">
            {callState === "ringing" ? (
              <div className="flex justify-center gap-8">
                <button onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                  <Icon name="PhoneOff" size={24} className="text-white" />
                </button>
              </div>
            ) : callState === "active" ? (
              <>
                <div className="flex justify-center gap-4 mb-4">
                  <button onClick={() => setIsMuted(m => !m)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/30 border border-red-500/50" : "glass"}`}>
                    <Icon name={isMuted ? "MicOff" : "Mic"} size={20} className={isMuted ? "text-red-400" : "text-white"} />
                  </button>
                  <button onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                    <Icon name="PhoneOff" size={24} className="text-white" />
                  </button>
                  <button onClick={() => setIsSpeaker(s => !s)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSpeaker ? "bg-neon-cyan/20 border border-neon-cyan/40" : "glass"}`}>
                    <Icon name="Volume2" size={20} className={isSpeaker ? "text-neon-cyan" : "text-white"} />
                  </button>
                </div>
                <button onClick={advanceCall}
                  className="w-full py-2.5 rounded-xl btn-primary-grad text-white font-body text-sm font-medium">
                  Продолжить диалог →
                </button>
              </>
            ) : (
              <div className="text-center text-muted-foreground font-body text-sm">Звонок завершён</div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes ripple {
            0% { opacity: 0.6; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.8); }
          }
          @keyframes sound-wave {
            from { transform: scaleY(1); }
            to { transform: scaleY(0.3); }
          }
        `}</style>
      </div>
    );
  }

  // CHAT SCREEN
  if (screen === "chat" && activeTeacher) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 py-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 glass-strong rounded-2xl p-3">
            <button onClick={() => setScreen("list")} className="glass rounded-xl p-2">
              <Icon name="ArrowLeft" size={18} className="text-white" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeTeacher.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {activeTeacher.avatar}
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold text-white text-sm">{activeTeacher.name}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-body">Онлайн</span>
              </div>
            </div>
            <button onClick={() => startCall(activeTeacher)}
              className="btn-primary-grad rounded-xl px-3 py-2 flex items-center gap-1.5 text-white text-xs font-body font-medium">
              <Icon name="Phone" size={14} />
              Звонок
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto mb-4 min-h-0">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`animate-fade-in flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                style={{ animationDelay: `${i * 0.05}s` }}>
                {msg.role === "ai" && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTeacher.color} flex items-center justify-center mr-2 flex-shrink-0 text-sm self-end`}>
                    {activeTeacher.avatar}
                  </div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-br-sm"
                    : "glass text-white rounded-bl-sm"
                }`}>
                  {msg.praise && msg.role === "ai" && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs text-amber-400">⭐ Похвала</span>
                    </div>
                  )}
                  <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="animate-fade-in flex justify-start">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeTeacher.color} flex items-center justify-center mr-2 flex-shrink-0 text-sm`}>
                  {activeTeacher.avatar}
                </div>
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/40"
                      style={{ animation: `pulse-dot 1.2s ${i * 0.3}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="glass-strong rounded-2xl p-3 flex items-center gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChatMessage()}
              placeholder="Напиши преподавателю..."
              className="flex-1 bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={sendChatMessage}
              disabled={!chatInput.trim()}
              className={`rounded-xl p-2.5 transition-all ${chatInput.trim() ? "btn-primary-grad text-white" : "glass text-muted-foreground"}`}>
              <Icon name="Send" size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LIST SCREEN
  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">ИИ-преподаватели</h1>
          <p className="text-muted-foreground font-body text-sm">
            Живое общение, голосовые звонки и персональная похвала
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { icon: "Phone", text: "Звонок с ИИ", color: "text-neon-purple" },
            { icon: "MessageCircle", text: "Чат 24/7", color: "text-neon-cyan" },
            { icon: "Star", text: "Эмоц. поддержка", color: "text-amber-400" },
            { icon: "TrendingUp", text: "Следит за прогрессом", color: "text-neon-green" },
          ].map(b => (
            <div key={b.text} className="glass flex items-center gap-2 px-3 py-1.5 rounded-full">
              <Icon name={b.icon as "Phone"} size={13} className={b.color} />
              <span className="text-xs font-body text-white">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Teachers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teachers.map((teacher, i) => (
            <div key={teacher.id}
              className="animate-fade-in glass rounded-3xl overflow-hidden card-hover"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}>

              {/* Top banner */}
              <div className={`bg-gradient-to-r ${teacher.color} p-5 flex items-center gap-4 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-16 h-16 bg-white/10 rounded-full" />
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 backdrop-blur-sm">
                  {teacher.avatar}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold text-white text-xl">{teacher.name}</h3>
                    <span className="text-lg">{teacher.flag}</span>
                  </div>
                  <p className="text-white/80 font-body text-xs mb-1">{teacher.spec}</p>
                  <p className="text-white/60 font-body text-xs italic">"{teacher.personality}"</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex border-b border-white/10">
                {[
                  { label: "Рейтинг", value: String(teacher.rating), icon: "Star" },
                  { label: "Студентов", value: teacher.students, icon: "Users" },
                  { label: "Уровни", value: teacher.level, icon: "BarChart2" },
                ].map(stat => (
                  <div key={stat.label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
                    <Icon name={stat.icon as "Star"} size={13} className="text-muted-foreground" />
                    <span className="font-display font-bold text-white text-sm">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-body">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Praise preview */}
              <div className="px-5 py-3 border-b border-white/10">
                <p className="text-xs text-muted-foreground font-body mb-1 flex items-center gap-1">
                  <Icon name="MessageSquare" size={11} />
                  Пример похвалы:
                </p>
                <p className="text-sm text-white font-body italic opacity-80 leading-relaxed">
                  "{teacher.praise[0]}"
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-3">
                <button
                  onClick={() => openChat(teacher)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 glass rounded-2xl text-white font-body text-sm font-medium hover:bg-white/10 transition-colors">
                  <Icon name="MessageCircle" size={16} className="text-neon-cyan" />
                  Чат
                </button>
                <button
                  onClick={() => startCall(teacher)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white font-body text-sm font-medium bg-gradient-to-r ${teacher.color} hover:opacity-90 transition-opacity`}
                  style={{ boxShadow: `0 4px 20px ${teacher.glow}` }}>
                  <Icon name="Phone" size={16} />
                  Позвонить
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
