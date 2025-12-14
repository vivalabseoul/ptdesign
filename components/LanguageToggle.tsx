import { useLanguage } from "../contexts/LanguageContext";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10"
      aria-label="Toggle language"
    >
      <span className={`text-sm font-semibold transition-colors ${language === 'ko' ? 'text-white' : 'text-gray-400'}`}>
        KOR
      </span>
      <span className="text-gray-500">|</span>
      <span className={`text-sm font-semibold transition-colors ${language === 'en' ? 'text-white' : 'text-gray-400'}`}>
        ENG
      </span>
    </button>
  );
}
