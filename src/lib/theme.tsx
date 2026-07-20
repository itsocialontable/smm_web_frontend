import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSettings {
  mode: ThemeMode;
  customColor: string; // hex color e.g. "#3b82f6"
  useCustomColor: boolean;
}

const THEME_KEY = "sf_theme";

const DEFAULT: ThemeSettings = {
  mode: "system",
  customColor: "#3b82f6",
  useCustomColor: false,
};

// Convert hex to HSL components as separate numbers
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 217, s: 91, l: 55 };
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function applyTheme(settings: ThemeSettings) {
  const html = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = settings.mode === "dark" || (settings.mode === "system" && prefersDark);

  // Apply dark/light
  html.classList.toggle("dark", isDark);

  // Apply custom color
  if (settings.useCustomColor && settings.customColor) {
    const { h, s, l } = hexToHsl(settings.customColor);
    html.style.setProperty("--custom-h", String(h));
    html.style.setProperty("--custom-s", `${s}%`);
    html.style.setProperty("--custom-l", `${l}%`);
    html.classList.add("theme-custom");
  } else {
    html.classList.remove("theme-custom");
    html.style.removeProperty("--custom-h");
    html.style.removeProperty("--custom-s");
    html.style.removeProperty("--custom-l");
  }
}

interface ThemeContextValue {
  theme: ThemeSettings;
  setTheme: (t: ThemeSettings) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSettings>(() => {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch { return DEFAULT; }
  });

  // Apply on mount + whenever theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Also listen for system preference changes when mode === "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => { if (theme.mode === "system") applyTheme(theme); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: ThemeSettings) => {
    localStorage.setItem(THEME_KEY, JSON.stringify(t));
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
