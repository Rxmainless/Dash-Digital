import { useTheme } from "../theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={isDark}
      className="theme-toggle"
    >
      <span
        className={`theme-toggle__dot ${
          isDark ? "theme-toggle__dot--dark" : "theme-toggle__dot--light"
        }`}
      />
      {isDark ? "MODO NOTURNO" : "MODO DIURNO"}
    </button>
  );
}