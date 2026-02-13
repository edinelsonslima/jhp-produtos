import { createStore } from "./useStore";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
] as const;

export type Theme = (typeof THEMES)[number];

type Actions = {
  get: () => Theme;
  list: () => Theme[];
  set: (theme: Theme) => void;
};

type State = {
  theme: Theme;
};

export const themeStore = createStore<State, Actions>({
  persist: { key: "theme" },

  createState: () => {
    document.documentElement.setAttribute("data-theme", "light");
    return {
      theme: "light",
    };
  },

  createActions: (set, get) => {
    // Apply persisted theme on store creation
    document.documentElement.setAttribute("data-theme", get().theme);

    return {
      get: () => get().theme,

      list: () => [...THEMES],

      set: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    };
  },
});
