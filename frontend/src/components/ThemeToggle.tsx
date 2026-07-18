import { useTheme } from "../Theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-pressed={isDark}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.4rem 0.9rem",
        borderRadius: "999px",
        border: `1px solid var(--border)`,
        background: "var(--surface)",
        color: "var(--ink)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: isDark ? "var(--accent-primary)" : "var(--accent-warm)",
          boxShadow: isDark ? "0 0 6px var(--accent-primary)" : "0 0 6px var(--accent-warm)",
          transition: "background 0.3s ease",
        }}
      />
      {isDark ? "MODO NOTURNO" : "MODO DIURNO"}
    </button>
  );
}