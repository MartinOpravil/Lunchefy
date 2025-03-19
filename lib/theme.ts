const DARK_MODE_KEY = "darkMode";

interface CssPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  text2: string;
}

const lightTheme: CssPalette = {
  primary: "#ff622c",
  secondary: "#a4b476",
  accent: "#cecece",
  background: "#ffffff",
  text: "#000000",
  text2: "#7f7f7f",
};

const darkTheme: CssPalette = {
  primary: "#ff622c",
  secondary: "#a4b476",
  accent: "#505050",
  background: "#1f1f1f",
  text: "#fff",
  text2: "#c4c4c4",
};

export const isSavedThemeDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const storedValue = localStorage.getItem(DARK_MODE_KEY);
  return storedValue ? JSON.parse(storedValue) : false;
};

export const setDarkMode = (value: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DARK_MODE_KEY, JSON.stringify(value));
  performCssRewrite(value);
};

const performCssRewrite = (toDark: boolean) => {
  const root = document.querySelector(":root");
  if (!root) return;

  const theme = toDark ? darkTheme : lightTheme;
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
};
