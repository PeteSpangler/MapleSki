import { create } from "zustand";
import { Bear, bearArray } from "../assets/bears/bearArray";
import { Jerry, jerryArray } from "../assets/jerries/jerryArray";
import { Mogul, mogulArray } from "../assets/moguls/mogulArray";
import { Mountain, mountainArray } from "../assets/mountains/mountainArray";
import { Tree, treeArray } from "../assets/trees/treeArray";

export const defaultDownhillSpeed = 1;
export const defaultBears = 0;
export const defaultTrees = 0;
export const defaultJerries = 0;
export const defaultNumberOfMoguls = 0;
export const defaultSnowDepth = 1;

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
  currentMogul: Mogul;
  currentRoundScore: number;
  currentSnowDepth: number;
  money: number;
  numberOfMoguls: number;
  numberOfBears: number;
  numberOfTrees: number;
  numberOfJerries: number;

  setCurrentView: (view: Views) => void;
  setCurrentMountain: (mountain: Mountain) => void;
  setCurrentBear: (bear: Bear) => void;
  setCurrentTree: (tree: Tree) => void;
  setCurrentJerry: (jerry: Jerry) => void;
  setCurrentMogul: (mogul: Mogul) => void;
  setCurrentRoundSore: (score: number) => void;
  setCurrentSnowDepth: (update: number | ((prev: number) => number)) => void;
  setMoney: (update: number | ((prev: number) => number)) => void;
  setNumberOfMoguls: (update: number | ((prev: number) => number)) => void;
  setNumberOfBears: (update: number | ((prev: number) => number)) => void;
  setNumberOfTrees: (update: number | ((prev: number) => number)) => void;
  setNumberOfJerries: (update: number | ((prev: number) => number)) => void;
  resetGame: () => void;
};

export const useAppStore = create<GameState>((set) => ({
  currentBear: bearArray[1],
  currentDownhillSpeed: defaultDownhillSpeed,
  currentJerry: jerryArray[1],
  currentMountain: mountainArray[0],
  currentMogul: mogulArray[1],
  currentTree: treeArray[1],
  currentRoundScore: 0,
  currentSnowDepth: defaultSnowDepth,
  currentView: Views.Menu,
  lastView: Views.Menu,
  money: 5,
  numberOfMoguls: defaultNumberOfMoguls,
  numberOfBears: defaultBears,
  numberOfTrees: defaultTrees,
  numberOfJerries: defaultJerries,

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

  setCurrentMogul: (mogul: Mogul) => set({ currentMogul: mogul }),

  setCurrentRoundSore(score) {
    set({ currentRoundScore: score });
  },

  setCurrentSnowDepth: (update: number | ((prev: number) => number)) =>
    set((state) => ({
      currentSnowDepth:
        typeof update === "function" ? update(state.currentSnowDepth) : update,
    })),

  setMoney: (update) =>
    set((state) => ({
      money: typeof update === "function" ? update(state.money) : update,
    })),

  setNumberOfBears: (update) =>
    set((state) => ({
      numberOfBears:
        typeof update === "function" ? update(state.numberOfBears) : update,
    })),

  setNumberOfJerries: (update) =>
    set((state) => ({
      numberOfJerries:
        typeof update === "function" ? update(state.numberOfJerries) : update,
    })),

  setNumberOfMoguls: (update) =>
    set((state) => ({
      numberOfMoguls:
        typeof update === "function" ? update(state.numberOfMoguls) : update,
    })),

  setNumberOfTrees: (update) =>
    set((state) => ({
      numberOfTrees:
        typeof update === "function" ? update(state.numberOfTrees) : update,
    })),

  resetGame: () =>
    set(() => ({
      currentBear: bearArray[1],
      currentDownhillSpeed: defaultDownhillSpeed,
      currentJerry: jerryArray[1],
      currentMogul: mogulArray[1],
      currentRoundScore: 0,
      currentSnowDepth: defaultSnowDepth,
      currentTree: treeArray[1],
      currentView: Views.Menu,
      lastView: Views.Menu,
      money: 5,
      numberOfMoguls: defaultNumberOfMoguls,
      numberOfBears: defaultBears,
      numberOfTrees: defaultTrees,
      numberOfJerries: defaultJerries,
    })),
}));
