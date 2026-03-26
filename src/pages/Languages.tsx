import { useState } from "react";
import Icon from "@/components/ui/icon";

const languages = [
  { code: "en", name: "Английский", native: "English", flag: "🇬🇧", speakers: "1.5 млрд", family: "Германские" },
  { code: "es", name: "Испанский", native: "Español", flag: "🇪🇸", speakers: "580 млн", family: "Романские" },
  { code: "fr", name: "Французский", native: "Français", flag: "🇫🇷", speakers: "280 млн", family: "Романские" },
  { code: "de", name: "Немецкий", native: "Deutsch", flag: "🇩🇪", speakers: "130 млн", family: "Германские" },
  { code: "zh", name: "Китайский", native: "中文", flag: "🇨🇳", speakers: "1.1 млрд", family: "Китайско-тибетские" },
  { code: "ja", name: "Японский", native: "日本語", flag: "🇯🇵", speakers: "125 млн", family: "Японские" },
  { code: "ko", name: "Корейский", native: "한국어", flag: "🇰🇷", speakers: "77 млн", family: "Корейские" },
  { code: "ar", name: "Арабский", native: "العربية", flag: "🇸🇦", speakers: "420 млн", family: "Семитские" },
  { code: "pt", name: "Португальский", native: "Português", flag: "🇧🇷", speakers: "250 млн", family: "Романские" },
  { code: "it", name: "Итальянский", native: "Italiano", flag: "🇮🇹", speakers: "70 млн", family: "Романские" },
  { code: "hi", name: "Хинди", native: "हिन्दी", flag: "🇮🇳", speakers: "600 млн", family: "Индоевропейские" },
  { code: "tr", name: "Турецкий", native: "Türkçe", flag: "🇹🇷", speakers: "80 млн", family: "Тюркские" },
  { code: "pl", name: "Польский", native: "Polski", flag: "🇵🇱", speakers: "50 млн", family: "Славянские" },
  { code: "nl", name: "Нидерландский", native: "Nederlands", flag: "🇳🇱", speakers: "24 млн", family: "Германские" },
  { code: "sv", name: "Шведский", native: "Svenska", flag: "🇸🇪", speakers: "10 млн", family: "Германские" },
  { code: "no", name: "Норвежский", native: "Norsk", flag: "🇳🇴", speakers: "5 млн", family: "Германские" },
  { code: "da", name: "Датский", native: "Dansk", flag: "🇩🇰", speakers: "6 млн", family: "Германские" },
  { code: "fi", name: "Финский", native: "Suomi", flag: "🇫🇮", speakers: "5 млн", family: "Финно-угорские" },
  { code: "el", name: "Греческий", native: "Ελληνικά", flag: "🇬🇷", speakers: "13 млн", family: "Греческие" },
  { code: "he", name: "Иврит", native: "עברית", flag: "🇮🇱", speakers: "9 млн", family: "Семитские" },
  { code: "th", name: "Тайский", native: "ภาษาไทย", flag: "🇹🇭", speakers: "60 млн", family: "Тай-кадайские" },
  { code: "vi", name: "Вьетнамский", native: "Tiếng Việt", flag: "🇻🇳", speakers: "85 млн", family: "Австро-азиатские" },
  { code: "id", name: "Индонезийский", native: "Bahasa Indonesia", flag: "🇮🇩", speakers: "270 млн", family: "Австронезийские" },
  { code: "cs", name: "Чешский", native: "Čeština", flag: "🇨🇿", speakers: "11 млн", family: "Славянские" },
  { code: "ro", name: "Румынский", native: "Română", flag: "🇷🇴", speakers: "24 млн", family: "Романские" },
  { code: "uk", name: "Украинский", native: "Українська", flag: "🇺🇦", speakers: "45 млн", family: "Славянские" },
  { code: "hu", name: "Венгерский", native: "Magyar", flag: "🇭🇺", speakers: "14 млн", family: "Финно-угорские" },
  { code: "sk", name: "Словацкий", native: "Slovenčina", flag: "🇸🇰", speakers: "5 млн", family: "Славянские" },
  { code: "hr", name: "Хорватский", native: "Hrvatski", flag: "🇭🇷", speakers: "7 млн", family: "Славянские" },
  { code: "bg", name: "Болгарский", native: "Български", flag: "🇧🇬", speakers: "8 млн", family: "Славянские" },
  { code: "ca", name: "Каталанский", native: "Català", flag: "🏴", speakers: "10 млн", family: "Романские" },
  { code: "sr", name: "Сербский", native: "Српски", flag: "🇷🇸", speakers: "12 млн", family: "Славянские" },
  { code: "lt", name: "Литовский", native: "Lietuvių", flag: "🇱🇹", speakers: "4 млн", family: "Балтийские" },
  { code: "lv", name: "Латышский", native: "Latviešu", flag: "🇱🇻", speakers: "2 млн", family: "Балтийские" },
  { code: "et", name: "Эстонский", native: "Eesti", flag: "🇪🇪", speakers: "1 млн", family: "Финно-угорские" },
  { code: "ms", name: "Малайский", native: "Bahasa Melayu", flag: "🇲🇾", speakers: "33 млн", family: "Австронезийские" },
  { code: "fa", name: "Персидский", native: "فارسی", flag: "🇮🇷", speakers: "80 млн", family: "Индоевропейские" },
  { code: "ur", name: "Урду", native: "اردو", flag: "🇵🇰", speakers: "170 млн", family: "Индоевропейские" },
  { code: "bn", name: "Бенгальский", native: "বাংলা", flag: "🇧🇩", speakers: "230 млн", family: "Индоевропейские" },
  { code: "sw", name: "Суахили", native: "Kiswahili", flag: "🇰🇪", speakers: "100 млн", family: "Банту" },
  { code: "af", name: "Африкаанс", native: "Afrikaans", flag: "🇿🇦", speakers: "7 млн", family: "Германские" },
  { code: "tl", name: "Филиппинский", native: "Filipino", flag: "🇵🇭", speakers: "90 млн", family: "Австронезийские" },
  { code: "ta", name: "Тамильский", native: "தமிழ்", flag: "🇱🇰", speakers: "75 млн", family: "Дравидийские" },
  { code: "te", name: "Телугу", native: "తెలుగు", flag: "🇮🇳", speakers: "83 млн", family: "Дравидийские" },
  { code: "mr", name: "Маратхи", native: "मराठी", flag: "🇮🇳", speakers: "83 млн", family: "Индоевропейские" },
  { code: "pa", name: "Панджабский", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", speakers: "130 млн", family: "Индоевропейские" },
  { code: "gu", name: "Гуджарати", native: "ગુજરાતી", flag: "🇮🇳", speakers: "56 млн", family: "Индоевропейские" },
  { code: "kn", name: "Каннада", native: "ಕನ್ನಡ", flag: "🇮🇳", speakers: "44 млн", family: "Дравидийские" },
  { code: "ml", name: "Малаялам", native: "മലയാളം", flag: "🇮🇳", speakers: "38 млн", family: "Дравидийские" },
  { code: "si", name: "Сингальский", native: "සිංහල", flag: "🇱🇰", speakers: "17 млн", family: "Индоевропейские" },
  { code: "ne", name: "Непальский", native: "नेपाली", flag: "🇳🇵", speakers: "17 млн", family: "Индоевропейские" },
];

interface LanguagesProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function Languages({ selectedLanguage, onLanguageChange }: LanguagesProps) {
  const [search, setSearch] = useState("");

  const filtered = languages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase()) ||
    l.family.toLowerCase().includes(search.toLowerCase())
  );

  const popular = languages.slice(0, 8);

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">Выбор языка</h1>
          <p className="text-muted-foreground font-body text-sm">
            50 языков мира — выбери свой путь
          </p>
        </div>

        {/* Current language */}
        <div className="animate-fade-in glass-strong rounded-3xl p-5 relative overflow-hidden" style={{ animationDelay: "0.1s" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 to-cyan-600/10" />
          <div className="relative flex items-center gap-4">
            <span className="text-4xl">{languages.find(l => l.name === selectedLanguage)?.flag ?? "🌍"}</span>
            <div>
              <p className="text-xs text-muted-foreground font-body mb-0.5">Изучаю сейчас</p>
              <h2 className="font-display font-bold text-white text-xl">{selectedLanguage}</h2>
              <p className="text-xs text-neon-cyan font-body">
                {languages.find(l => l.name === selectedLanguage)?.speakers ?? "—"} носителей
              </p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-xs text-emerald-400 font-body">Активный</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular */}
        <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-display font-semibold text-white text-base mb-3">Популярные</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {popular.map(lang => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.name)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
                  selectedLanguage === lang.name
                    ? "glass-strong border border-purple-500/50 glow-purple"
                    : "glass hover:bg-white/10"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-xs text-muted-foreground font-body truncate w-full text-center">{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="animate-fade-in glass rounded-2xl flex items-center gap-3 px-4 py-3" style={{ animationDelay: "0.2s" }}>
          <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти язык..."
            className="flex-1 bg-transparent text-white font-body text-sm outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-white">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* All languages */}
        <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <p className="text-xs text-muted-foreground font-body mb-3">
            {filtered.length} из {languages.length} языков
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((lang, i) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.name)}
                className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 card-hover ${
                  selectedLanguage === lang.name
                    ? "glass-strong border border-purple-500/40 glow-purple"
                    : "glass hover:bg-white/8"
                }`}
                style={{ animationDelay: `${i * 0.02}s` }}
              >
                <span className="text-3xl flex-shrink-0">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-white text-sm">{lang.name}</span>
                    {selectedLanguage === lang.name && (
                      <Icon name="CheckCircle" size={14} className="text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-body">{lang.native}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-neon-cyan font-body">{lang.speakers}</div>
                  <div className="text-xs text-muted-foreground font-body">{lang.family}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
