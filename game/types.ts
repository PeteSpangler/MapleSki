import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SKIER_SIZE = 40;
export const OBSTACLE_SIZE = 30;

export interface Obstacle {
  id: number;
  type: 'tree' | 'jerry' | 'mogul' | 'bear';
  x: number;
  y: number;
  passed: boolean;
}

export interface Position {
  x: number;
  y: number;
}