import { ref, watch } from 'vue';
import en from '../locales/en.json';
import ta from '../locales/ta.json';
import si from '../locales/si.json';

type LanguageCode = 'en' | 'ta' | 'si';

// Mapping of translation files
const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  ta,
  si
};

// Available languages list for UI
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' }
] as const;

// Helper to determine initial language
const getInitialLanguage = (): LanguageCode => {
  const saved = localStorage.getItem('language') as LanguageCode;
  if (saved && ['en', 'ta', 'si'].includes(saved)) {
    return saved;
  }
  
  // Auto-detect browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ta')) return 'ta';
  if (browserLang.startsWith('si')) return 'si';
  
  return 'en'; // default
};

// Global state for language
const currentLanguage = ref<LanguageCode>(getInitialLanguage());

// Watch for changes and save to localStorage
watch(currentLanguage, (newLang) => {
  localStorage.setItem('language', newLang);
});

export function useLanguage() {
  const setLanguage = (lang: LanguageCode) => {
    currentLanguage.value = lang;
  };

  const t = (key: string): string => {
    const langDict = translations[currentLanguage.value];
    return langDict[key] || translations['en'][key] || key;
  };

  return {
    currentLanguage,
    availableLanguages,
    setLanguage,
    t
  };
}
