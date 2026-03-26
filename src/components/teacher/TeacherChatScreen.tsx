import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Teacher, Message } from "./teachers.data";

interface TeacherChatScreenProps {
  teacher: Teacher;
  chatMessages: Message[];
  chatInput: string;
  isTyping: boolean;
  onBack: () => void;
  onStartCall: (teacher: Teacher) => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function TeacherChatScreen({
  teacher,
  chatMessages,
  chatInput,
  isTyping,
  onBack,
  onStartCall,
  onInputChange,
  onSendMessage,
}: TeacherChatScreenProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col px-4 py-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 glass-strong rounded-2xl p-3">
          <button onClick={onBack} className="glass rounded-xl p-2">
            <Icon name="ArrowLeft" size={18} className="text-white" />
          </button>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center text-xl flex-shrink-0`}>
            {teacher.avatar}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-white text-sm">{teacher.name}</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-body">Онлайн</span>
            </div>
          </div>
          <button
            onClick={() => onStartCall(teacher)}
            className="btn-primary-grad rounded-xl px-3 py-2 flex items-center gap-1.5 text-white text-xs font-body font-medium">
            <Icon name="Phone" size={14} />
            Звонок
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto mb-4 min-h-0">
          {chatMessages.map((msg, i) => (
            <div key={i}
              className={`animate-fade-in flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              {msg.role === "ai" && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center mr-2 flex-shrink-0 text-sm self-end`}>
                  {teacher.avatar}
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
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center mr-2 flex-shrink-0 text-sm`}>
                {teacher.avatar}
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
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSendMessage()}
            placeholder="Напиши преподавателю..."
            className="flex-1 bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onSendMessage}
            disabled={!chatInput.trim()}
            className={`rounded-xl p-2.5 transition-all ${chatInput.trim() ? "btn-primary-grad text-white" : "glass text-muted-foreground"}`}>
            <Icon name="Send" size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
