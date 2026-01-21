import { useAppStore } from "../hooks/game-state";
import { useCallback } from "react";
import { OBSTACLE_SIZE, Obstacle, SCREEN_HEIGHT, SCREEN_WIDTH } from "./types";
import { mountainArray } from "../assets/mountains/mountainArray";
import { treeArray } from "../assets/trees/treeArray";
import { jerryArray } from "../assets/jerries/jerryArray";
import { mogulArray } from "../assets/moguls/mogulArray";
import { bearArray } from "../assets/bears/bearArray";

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

export const useObstacleSpawner = (
  gameStarted: boolean,
  shouldSpawnTrees: boolean,
  shouldSpawnJerries: boolean,
  shouldSpawnMoguls: boolean,
  shouldSpawnBears: boolean,
  spawnedCounts: { trees: number; jerries: number; moguls: number; bears: number },
  numberOfTrees: number,
  numberOfJerries: number,
  numberOfMoguls: number,
  numberOfBears: number,
) => {
  const spawnObstacle = useCallback((): Obstacle | null => {
    if (!gameStarted) return null;

    const canSpawnTrees = shouldSpawnTrees && spawnedCounts.trees < numberOfTrees;
    const canSpawnJerries = shouldSpawnJerries && spawnedCounts.jerries < numberOfJerries;
    const canSpawnMoguls = shouldSpawnMoguls && spawnedCounts.moguls < numberOfMoguls;
    const canSpawnBears = shouldSpawnBears && spawnedCounts.bears < numberOfBears;

    const availableObstacles: ("tree" | "jerry" | "mogul" | "bear")[] = [];
    if (canSpawnTrees) availableObstacles.push("tree");
    if (canSpawnJerries) availableObstacles.push("jerry");
    if (canSpawnMoguls) availableObstacles.push("mogul");
    if (canSpawnBears) availableObstacles.push("bear");

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
    spawnedCounts,
    numberOfTrees,
    numberOfJerries,
    numberOfMoguls,
    numberOfBears,
  ]);

  return { spawnObstacle };
};

export const useMountainSelection = () => {
  const { setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears } = useAppStore();

  const selectMountain = useCallback((mountain: typeof mountainArray[0]) => {
    setCurrentTree(mountain.trees > 0 ? treeArray[1] : treeArray[0]);
    setCurrentJerry(mountain.jerries > 0 ? jerryArray[1] : jerryArray[0]);
    setCurrentMogul(mountain.moguls > 0 ? mogulArray[1] : mogulArray[0]);
    setCurrentBear(mountain.bears > 0 ? bearArray[1] : bearArray[0]);
    setNumberOfTrees(mountain.trees);
    setNumberOfJerries(mountain.jerries);
    setNumberOfMoguls(mountain.moguls);
    setNumberOfBears(mountain.bears);
  }, [setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears]);

  return { selectMountain };
};
