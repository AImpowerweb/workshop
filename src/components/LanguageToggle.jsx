import { useLanguage } from '../context/LanguageContext';

const OPTIONS = [
  { value: 'en', label: 'EN' },
  { value: 'zh', label: '中文' },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-0.5"
      role="group"
      aria-label="Language / 语言"
    >
      {OPTIONS.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLang(option.value)}
            aria-pressed={active}
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:min-h-0 sm:py-1 ${
              active
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
