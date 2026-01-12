import { create } from "zustand";
import { Bear, bearArray } from "../assets/bears/bearArray";
import { Jerry, jerryArray } from "../assets/jerries/jerryArray";
import { Mountain, mountainArray } from "../assets/mountains/mountainArray";
import { Tree, treeArray } from "../assets/trees/treeArray";

export const defaultDownhillSpeed = 1;
export const defaultBears = 1;
export const defaultTrees = 1;
export const defaultJerries = 0;
export const defaultMoguls = 0;

export enum Views {
  Menu,
  DifficultySelect,
  GameScreen,
  Shop,
  DefeatScreen,
}

type GameState = {
  currentView: Views;
  lastView: Views;
  currentDownhillSpeed: number;
  currentMountain: Mountain;
  currentBear: Bear;
  currentTree: Tree;
  currentJerry: Jerry;
  currentMoguls: number;
  currentRoundScore: number;
  money: number;

  setCurrentView: (view: Views) => void;
  setCurrentMountain: (mountain: Mountain) => void;
  setCurrentBear: (bear: Bear) => void;
  setCurrentTree: (tree: Tree) => void;
  setCurrentJerry: (jerry: Jerry) => void;
  setCurrentMoguls: (update: number | ((prev: number) => number)) => void;
  setMoney: (update: number | ((prev: number) => number)) => void;
  setCurrentRoundSore: (score: number) => void;
  resetGame: () => void;
};

export const useAppStore = create<GameState>((set) => ({
  currentBear: bearArray[0],
  currentDownhillSpeed: defaultDownhillSpeed,
  currentJerry: jerryArray[0],
  currentMoguls: defaultMoguls,
  currentMountain: mountainArray[0],
  currentTree: treeArray[0],
  currentRoundScore: 0,
  currentView: Views.Menu,
  lastView: Views.Menu,
  money: 5,

  setCurrentView: (view: Views) =>
    set((state) => ({
      lastView: state.currentView,
      currentView: view,
    })),

  setCurrentMountain: (mountain: Mountain) =>
    set({ currentMountain: mountain }),

  setCurrentBear: (bear: Bear) => set({ currentBear: bear }),

  setCurrentTree: (tree: Tree) => set({ currentTree: tree }),

  setCurrentJerry: (jerry: Jerry) => set({ currentJerry: jerry }),

  setCurrentMoguls: (update) =>
    set((state) => ({
      currentMoguls:
        typeof update === "function" ? update(state.currentMoguls) : update,
    })),

  setMoney: (update) =>
    set((state) => ({
      money: typeof update === "function" ? update(state.money) : update,
    })),

  setCurrentRoundSore(score) {
    set({ currentRoundScore: score });
  },

  resetGame: () =>
    set(() => ({
      currentView: Views.Menu,
      lastView: Views.Menu,
      currentDownhillSpeed: defaultDownhillSpeed,
      currentBear: bearArray[0],
      currentTree: treeArray[0],
      currentJerry: jerryArray[0],
      currentMoguls: defaultMoguls,
      money: 5,
    })),
}));
