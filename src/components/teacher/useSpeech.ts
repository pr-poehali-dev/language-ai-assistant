import { useCallback, useRef } from "react";

export type VoiceGender = "female" | "male";

const LANG_MAP: Record<string, string> = {
  en: "en-GB",
  es: "es-ES",
  ja: "ja-JP",
  fr: "fr-FR",
};

function pickVoice(voices: SpeechSynthesisVoice[], lang: string, gender: VoiceGender): SpeechSynthesisVoice | null {
  const langCode = LANG_MAP[lang] ?? lang;
  const base = langCode.split("-")[0];

  const candidates = voices.filter(v =>
    v.lang.startsWith(base) || v.lang.startsWith(langCode)
  );

  if (candidates.length === 0) return voices[0] ?? null;

  const femaleKeywords = ["female", "woman", "girl", "zira", "hazel", "susan", "karen", "samantha", "victoria", "fiona", "allison", "ava", "kate", "moira", "veena", "kyoko", "o-ren", "amelie", "paulina", "milena"];
  const maleKeywords = ["male", "man", "guy", "david", "mark", "daniel", "alex", "jorge", "diego", "thomas", "nicolas", "otoya", "sin-ji", "kyoko"];

  const keywords = gender === "female" ? femaleKeywords : maleKeywords;

  const matched = candidates.find(v =>
    keywords.some(k => v.name.toLowerCase().includes(k))
  );

  if (matched) return matched;

  // Fallback: для female берём первый голос с этим языком, для male — второй если есть
  if (gender === "female") return candidates[0];
  return candidates[candidates.length > 1 ? 1 : 0];
}

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string, gender: VoiceGender) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const langCode = LANG_MAP[lang] ?? "en-GB";
    utterance.lang = langCode;
    utterance.rate = 0.95;
    utterance.pitch = gender === "female" ? 1.15 : 0.85;
    utterance.volume = 1;

    const loadAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = pickVoice(voices, lang, gender);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      loadAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        loadAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
