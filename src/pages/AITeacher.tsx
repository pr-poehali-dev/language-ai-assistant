import { useState, useRef } from "react";
import { teachers, CALL_MESSAGES, Teacher, Message, Screen } from "@/components/teacher/teachers.data";
import TeacherCallScreen from "@/components/teacher/TeacherCallScreen";
import TeacherChatScreen from "@/components/teacher/TeacherChatScreen";
import TeacherListScreen from "@/components/teacher/TeacherListScreen";

interface AITeacherProps {
  selectedLanguage: string;
}

export default function AITeacher({ selectedLanguage: _selectedLanguage }: AITeacherProps) {
  const [screen, setScreen] = useState<Screen>("list");
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<"ringing" | "active" | "ended">("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgStep, setMsgStep] = useState(0);
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState("");
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = (teacher: Teacher) => {
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

  const openChat = (teacher: Teacher) => {
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

  if (screen === "call" && activeTeacher) {
    return (
      <TeacherCallScreen
        teacher={activeTeacher}
        callState={callState}
        callDuration={callDuration}
        isMuted={isMuted}
        isSpeaker={isSpeaker}
        isTeacherSpeaking={isTeacherSpeaking}
        showPraise={showPraise}
        praiseText={praiseText}
        messages={messages}
        onEndCall={endCall}
        onAdvanceCall={advanceCall}
        onToggleMute={() => setIsMuted(m => !m)}
        onToggleSpeaker={() => setIsSpeaker(s => !s)}
      />
    );
  }

  if (screen === "chat" && activeTeacher) {
    return (
      <TeacherChatScreen
        teacher={activeTeacher}
        chatMessages={chatMessages}
        chatInput={chatInput}
        isTyping={isTyping}
        onBack={() => setScreen("list")}
        onStartCall={startCall}
        onInputChange={setChatInput}
        onSendMessage={sendChatMessage}
      />
    );
  }

  return (
    <TeacherListScreen
      teachers={teachers}
      onStartCall={startCall}
      onOpenChat={openChat}
    />
  );
}
