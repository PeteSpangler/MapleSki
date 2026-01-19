import { useAppStore } from "../hooks/game-state";
import { useCallback } from "react";
import { OBSTACLE_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./types";

export const useGameControls = (gameStarted: boolean) => {
  const moveSkierLeft = useCallback(():
    | { type: "left"; x: number }
    | undefined => {
    if (!gameStarted) return;
    return { type: "left", x: -25 };
  }, [gameStarted]);

  const moveSkierRight = useCallback(():
    | { type: "right"; x: number }
    | undefined => {
    if (!gameStarted) return;
    return { type: "right", x: 25 };
  }, [gameStarted]);

  return { moveSkierLeft, moveSkierRight };
};

export const useObstacleSpawner = (gameStarted: boolean) => {
  const { currentTree, currentJerry, currentMogul, currentBear } =
    useAppStore();

  const shouldSpawnTrees = currentTree.index !== 0;
  const shouldSpawnJerries = currentJerry.index !== 0;
  const shouldSpawnMoguls = currentMogul.index !== 0;
  const shouldSpawnBears = currentBear.index !== 0;

  const spawnObstacle = useCallback(() => {
    if (!gameStarted) return null;

    const availableObstacles: ("tree" | "jerry" | "mogul" | "bear")[] = [];
    if (shouldSpawnTrees) availableObstacles.push("tree");
    if (shouldSpawnJerries) availableObstacles.push("jerry");
    if (shouldSpawnMoguls) availableObstacles.push("mogul");
    if (shouldSpawnBears) availableObstacles.push("bear");

    if (availableObstacles.length === 0) return null;

    const type =
      availableObstacles[Math.floor(Math.random() * availableObstacles.length)];
    return {
      id: Date.now() + Math.random(),
      type: type,
      x: Math.random() * (SCREEN_WIDTH - OBSTACLE_SIZE),
      y: SCREEN_HEIGHT,
      passed: false,
    };
  }, [
    gameStarted,
    shouldSpawnTrees,
    shouldSpawnJerries,
    shouldSpawnMoguls,
    shouldSpawnBears,
  ]);

  return { spawnObstacle };
};
