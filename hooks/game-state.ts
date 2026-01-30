import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bear, bearArray } from "../assets/bears/bearArray";
import { Jerry, jerryArray } from "../assets/jerries/jerryArray";
import { Mogul, mogulArray } from "../assets/moguls/mogulArray";
import { Mountain, mountainArray } from "../assets/mountains/mountainArray";
import { Tree, treeArray } from "../assets/trees/treeArray";
import { Obstacle, SCREEN_WIDTH, SCREEN_HEIGHT, SKIER_SIZE } from "../game/types";

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

export interface HighScore {
  username: string;
  score: number;
  date: number;
}

export interface GameState {
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
  
  // Game runtime state
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  highScores: HighScore[];
  skierPosition: { x: number; y: number };
  obstacles: Obstacle[];
  gameSpeed: number;
  
  // Actions
  loadHighScores: () => Promise<void>;
  setCurrentView: (view: Views) => void;
  setCurrentMountain: (mountain: Mountain) => void;
  setCurrentBear: (bear: Bear) => void;
  setCurrentTree: (tree: Tree) => void;
  setCurrentJerry: (jerry: Jerry) => void;
  setCurrentMogul: (mogul: Mogul) => void;
  setCurrentRoundScore: (score: number) => void;
  setCurrentSnowDepth: (update: number | ((prev: number) => number)) => void;
  setMoney: (update: number | ((prev: number) => number)) => void;
  setNumberOfMoguls: (update: number | ((prev: number) => number)) => void;
  setNumberOfBears: (update: number | ((prev: number) => number)) => void;
  setNumberOfTrees: (update: number | ((prev: number) => number)) => void;
  setNumberOfJerries: (update: number | ((prev: number) => number)) => void;
  resetGame: () => void;
  
  // Game actions
  startGame: () => void;
  stopGame: () => void;
  updateSkierPosition: (position: { x: number; y: number }) => void;
  addObstacle: (obstacle: Obstacle) => void;
  updateObstacles: (obstacles: Obstacle[]) => void;
  setGameSpeed: (update: number | ((prev: number) => number)) => void;
  addScore: (points: number) => void;
  endGame: () => void;
  saveHighScore: (username: string, score: number) => Promise<void>;
  clearHighScores: () => Promise<void>;
}

const getDefaultState = () => ({
  currentBear: bearArray[1] || { index: 0, type: "None" },
  currentDownhillSpeed: defaultDownhillSpeed,
  currentJerry: jerryArray[1] || { index: 0, type: "None" },
  currentMountain: mountainArray[0] || { index: 0, name: "Default", desc: "Default", trees: 0, jerries: 0, moguls: 0, bears: 0 },
  currentMogul: mogulArray[1] || { index: 0, type: "none" },
  currentTree: treeArray[1] || { index: 0, type: "None" },
  currentRoundScore: 0,
  currentSnowDepth: defaultSnowDepth,
  currentView: Views.Menu,
  lastView: Views.Menu,
  money: 5,
  numberOfMoguls: defaultNumberOfMoguls,
  numberOfBears: defaultBears,
  numberOfTrees: defaultTrees,
  numberOfJerries: defaultJerries,
  
  // Game runtime state
  gameStarted: false,
  gameOver: false,
  score: 0,
  highScores: [] as HighScore[],
  skierPosition: { x: 0, y: 0 },
  obstacles: [] as Obstacle[],
  gameSpeed: 2.5,
});

export const useAppStore = create<GameState>()(
  (set, get) => ({
    ...getDefaultState(),
    
    // Load high scores from AsyncStorage on init
    loadHighScores: async () => {
      try {
        const stored = await AsyncStorage.getItem('maple-ski-highscores');
        if (stored) {
          const highScores = JSON.parse(stored);
          set({ highScores });
        }
      } catch (error) {
        console.log('Failed to load high scores:', error);
      }
    },

    // View setters
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

    setCurrentRoundScore: (score: number) => set({ currentRoundScore: score }),

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

    resetGame: () => {
      const defaultState = getDefaultState();
      set({
        ...defaultState,
        currentView: get().currentView, // Keep current view
        lastView: get().lastView, // Keep last view
        highScores: get().highScores, // Keep high scores
      });
    },

    // Game actions
    startGame: () =>
      set(() => ({
        gameStarted: true,
        gameOver: false,
        score: 0,
        skierPosition: { x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2, y: SCREEN_HEIGHT * 0.5 },
        obstacles: [],
        gameSpeed: 2.5,
      })),

    stopGame: () =>
      set(() => ({
        gameStarted: false,
      })),

    updateSkierPosition: (position: { x: number; y: number }) =>
      set(() => ({ skierPosition: position })),

    addObstacle: (obstacle: Obstacle) =>
      set((state) => ({
        obstacles: [...state.obstacles, obstacle],
      })),

    updateObstacles: (obstacles: Obstacle[]) =>
      set(() => ({ obstacles })),

    setGameSpeed: (update) =>
      set((state) => ({
        gameSpeed: typeof update === "function" ? update(state.gameSpeed) : update,
      })),

    addScore: (points: number) =>
      set((state) => ({ score: state.score + points })),

    endGame: () =>
      set(() => ({
        gameOver: true,
        gameStarted: false,
        currentView: Views.DefeatScreen,
      })),

    saveHighScore: async (username: string, score: number) => {
      try {
        const newHighScore: HighScore = {
          username: username.toUpperCase(),
          score,
          date: Date.now(),
        };
        
        const currentHighScores = get().highScores;
        const updatedHighScores = [...currentHighScores, newHighScore]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        set({ highScores: updatedHighScores });
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('maple-ski-highscores', JSON.stringify(updatedHighScores));
      } catch (error) {
        console.log('Failed to save high score:', error);
      }
    },

    clearHighScores: async () => {
      try {
        set({ highScores: [] });
        await AsyncStorage.removeItem('maple-ski-highscores');
      } catch (error) {
        console.log('Failed to clear high scores:', error);
      }
    },
  })
);