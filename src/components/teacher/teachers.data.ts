export type VoiceGender = "female" | "male";

export type Teacher = {
  id: number;
  name: string;
  lang: string;
  flag: string;
  avatar: string;
  color: string;
  glow: string;
  spec: string;
  personality: string;
  level: string;
  rating: number;
  students: string;
  praise: string[];
  voiceLang: string;
  voiceGender: VoiceGender;
};

export type Message = { role: "ai" | "user"; text: string; praise?: boolean };

export type Screen = "list" | "call" | "chat";

export const teachers: Teacher[] = [
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
    voiceLang: "en",
    voiceGender: "female",
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
    voiceLang: "es",
    voiceGender: "male",
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
    voiceLang: "ja",
    voiceGender: "female",
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
    voiceLang: "fr",
    voiceGender: "male",
    praise: [
      "Magnifique! Твой французский звучит как поэзия! C'est parfait! 🥐",
      "Bravo! Париж ждёт тебя — ты уже говоришь как парижанин! 🗼",
      "Extraordinaire! Такого прогресса я не видел давно! Tu es brillant! 🌹",
    ],
  },
];

export const CALL_MESSAGES: Record<string, Message[]> = {
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