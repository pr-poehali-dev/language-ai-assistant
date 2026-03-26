import Icon from "@/components/ui/icon";
import { Teacher, Message } from "./teachers.data";

interface TeacherCallScreenProps {
  teacher: Teacher;
  callState: "ringing" | "active" | "ended";
  callDuration: number;
  isMuted: boolean;
  isSpeaker: boolean;
  isTeacherSpeaking: boolean;
  showPraise: boolean;
  praiseText: string;
  messages: Message[];
  onEndCall: () => void;
  onAdvanceCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function TeacherCallScreen({
  teacher,
  callState,
  callDuration,
  isMuted,
  isSpeaker,
  isTeacherSpeaking,
  showPraise,
  praiseText,
  messages,
  onEndCall,
  onAdvanceCall,
  onToggleMute,
  onToggleSpeaker,
}: TeacherCallScreenProps) {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">

        {/* Status bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onEndCall} className="glass rounded-xl p-2">
            <Icon name="ChevronDown" size={20} className="text-white" />
          </button>
          <span className="font-display text-sm text-white">
            {callState === "ringing" ? "Вызов..." : callState === "active" ? formatTime(callDuration) : "Завершён"}
          </span>
          <div className="w-9" />
        </div>

        {/* Teacher avatar */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-6">
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
            {isTeacherSpeaking && (
              <div className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${teacher.glow} 0%, transparent 70%)`,
                  animation: "glow-pulse 1s ease-in-out infinite",
                  transform: "scale(1.4)",
                }} />
            )}
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center text-6xl shadow-2xl relative z-10`}
              style={{ boxShadow: isTeacherSpeaking ? `0 0 50px ${teacher.glow}` : "none", transition: "box-shadow 0.3s ease" }}>
              {teacher.avatar}
            </div>
          </div>

          <h2 className="font-display font-bold text-white text-2xl mb-1">{teacher.name}</h2>
          <p className="text-muted-foreground font-body text-sm mb-2">
            Преподаватель {teacher.lang}
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
                  msg.role === "user" ? "bg-purple-600/50 text-white" : "glass text-white"
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
              <button onClick={onEndCall}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                <Icon name="PhoneOff" size={24} className="text-white" />
              </button>
            </div>
          ) : callState === "active" ? (
            <>
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={onToggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/30 border border-red-500/50" : "glass"}`}>
                  <Icon name={isMuted ? "MicOff" : "Mic"} size={20} className={isMuted ? "text-red-400" : "text-white"} />
                </button>
                <button onClick={onEndCall}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                  <Icon name="PhoneOff" size={24} className="text-white" />
                </button>
                <button onClick={onToggleSpeaker}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSpeaker ? "bg-neon-cyan/20 border border-neon-cyan/40" : "glass"}`}>
                  <Icon name="Volume2" size={20} className={isSpeaker ? "text-neon-cyan" : "text-white"} />
                </button>
              </div>
              <button onClick={onAdvanceCall}
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
