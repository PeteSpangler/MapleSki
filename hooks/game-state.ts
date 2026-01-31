import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mountain, mountainArray } from "../assets/mountains/mountainArray";
import { Obstacle, SCREEN_WIDTH, SCREEN_HEIGHT, SKIER_SIZE } from "../game/types";

export enum Views {
  Menu,
  GameScreen,
  DefeatScreen,
}

export interface HighScore {
  username: string;
  score: number;
  date: number;
}

export interface GameState {
  currentView: Views;
  currentMountain: Mountain;
  
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  highScores: HighScore[];
  skierPosition: { x: number; y: number };
  obstacles: Obstacle[];
  gameSpeed: number;
  dynamicObstacleLimits: {
    trees: number;
    jerries: number;
    moguls: number;
    bears: number;
  };
  
  loadHighScores: () => Promise<void>;
  setCurrentView: (view: Views) => void;
  setCurrentMountain: (mountain: Mountain) => void;
  resetGame: () => void;
  
  startGame: () => void;
  stopGame: () => void;
  updateSkierPosition: (position: { x: number; y: number }) => void;
  addObstacle: (obstacle: Obstacle) => void;
  updateObstacles: (obstacles: Obstacle[]) => void;
  setGameSpeed: (update: number | ((prev: number) => number)) => void;
  addScore: (points: number) => void;
  endGame: () => void;
  setDynamicObstacleLimits: (limits: { trees: number; jerries: number; moguls: number; bears: number }) => void;
  saveHighScore: (username: string, score: number) => Promise<void>;
}

const getDefaultState = () => ({
  currentMountain: mountainArray[0] || { index: 0, name: "Default", desc: "Default", trees: 0, jerries: 0, moguls: 0, bears: 0 },
  currentView: Views.Menu,
  
  gameStarted: false,
  gameOver: false,
  score: 0,
  highScores: [] as HighScore[],
  skierPosition: { x: 0, y: 0 },
  obstacles: [] as Obstacle[],
  gameSpeed: 5,
  dynamicObstacleLimits: {
    trees: 0,
    jerries: 0,
    moguls: 0,
    bears: 0,
  },
});

export const useAppStore = create<GameState>()(
  (set, get) => ({
    ...getDefaultState(),
    
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

    setCurrentView: (view: Views) =>
      set({ currentView: view }),

    setCurrentMountain: (mountain: Mountain) =>
      set({ currentMountain: mountain }),

    resetGame: () => {
      const defaultState = getDefaultState();
      set({
        ...defaultState,
        currentView: get().currentView,
        highScores: get().highScores,
      });
    },

    startGame: () =>
      set(() => ({
        gameStarted: true,
        gameOver: false,
        score: 0,
        skierPosition: { x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2, y: SCREEN_HEIGHT * 0.5 },
        obstacles: [],
        gameSpeed: 5,
        dynamicObstacleLimits: {
          trees: get().currentMountain.trees,
          jerries: get().currentMountain.jerries,
          moguls: get().currentMountain.moguls,
          bears: get().currentMountain.bears,
        },
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

    setDynamicObstacleLimits: (limits: { trees: number; jerries: number; moguls: number; bears: number }) =>
      set(() => ({ dynamicObstacleLimits: limits })),

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
        
        await AsyncStorage.setItem('maple-ski-highscores', JSON.stringify(updatedHighScores));
      } catch (error) {
        console.log('Failed to save high score:', error);
      }
    },
  })
);