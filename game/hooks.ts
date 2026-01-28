import { useCallback } from "react";
import { useAppStore } from "../hooks/game-state";
import { OBSTACLE_SIZE, Obstacle, SCREEN_HEIGHT, SCREEN_WIDTH, SKIER_SIZE } from "./types";

// Collision detection utility
export const checkCollision = (
  skierX: number,
  skierY: number,
  obstacle: Obstacle
): boolean => {
  const distance = Math.sqrt(
    Math.pow(skierX - obstacle.x, 2) + Math.pow(skierY - obstacle.y, 2)
  );
  return distance < (SKIER_SIZE + OBSTACLE_SIZE) / 2;
};

// Game controls hook
export const useGameControls = () => {
  const { skierPosition, updateSkierPosition, gameStarted } = useAppStore();

  const moveSkier = useCallback((touchX: number) => {
    if (!gameStarted || !updateSkierPosition) return;

    // Constrain Y position to 30%-70% of screen height
    const minY = SCREEN_HEIGHT * 0.3;
    const maxY = SCREEN_HEIGHT * 0.7;
    const targetY = minY + (maxY - minY) / 2; // Fixed Y position in middle of allowed range

    // Full X range movement based on touch
    const newX = Math.max(
      SKIER_SIZE / 2,
      Math.min(SCREEN_WIDTH - SKIER_SIZE / 2, touchX)
    );

    try {
      updateSkierPosition({ x: newX, y: targetY });
    } catch (error) {
      console.error('Error in moveSkier:', error);
    }
  }, [gameStarted, updateSkierPosition]);

  return { moveSkier };
};

// Obstacle spawner hook
export const useObstacleSpawner = () => {
  const { 
    currentMountain,
    obstacles,
    addObstacle,
    updateObstacles,
    gameSpeed,
    setGameSpeed,
    score,
    addScore,
    endGame,
    skierPosition
  } = useAppStore();

  const spawnObstacle = useCallback((): Obstacle | null => {
    try {
      // Safety check for currentMountain
      if (!currentMountain) return null;

      // Safety check for obstacles array
      if (!obstacles || !Array.isArray(obstacles)) return null;

      // Count current obstacles by type
      const currentCounts = obstacles.reduce((acc, obstacle) => {
        if (!obstacle || !obstacle.type) return acc;
        acc[obstacle.type] = (acc[obstacle.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Check which obstacle types can still be spawned
      const maxTrees = currentMountain.trees || 0;
      const maxJerries = currentMountain.jerries || 0;
      const maxMoguls = currentMountain.moguls || 0;
      const maxBears = currentMountain.bears || 0;

      const availableTypes: ('tree' | 'jerry' | 'mogul' | 'bear')[] = [];
      
      if (currentCounts.tree < maxTrees) availableTypes.push('tree');
      if (currentCounts.jerry < maxJerries) availableTypes.push('jerry');
      if (currentCounts.mogul < maxMoguls) availableTypes.push('mogul');
      if (currentCounts.bear < maxBears) availableTypes.push('bear');

      // If all obstacles are at maximum, don't spawn more
      if (availableTypes.length === 0) return null;

      // Randomly select from available types
      const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

      return {
        id: Date.now() + Math.random(),
        type,
        x: Math.random() * (SCREEN_WIDTH - OBSTACLE_SIZE),
        y: SCREEN_HEIGHT, // Start at bottom of screen
        passed: false,
      };
    } catch (error) {
      console.error('Error in spawnObstacle:', error);
      return null;
    }
  }, [currentMountain, obstacles]);

  const updateGame = useCallback(() => {
    // Move obstacles up the screen and remove those that went off screen
    const updatedObstacles = obstacles
      .map((obstacle) => ({
        ...obstacle,
        y: obstacle.y - gameSpeed * 2, // Move up
      }))
      .filter((obstacle) => obstacle.y > -OBSTACLE_SIZE);

    // Check for collisions
    const collision = updatedObstacles.some((obstacle) =>
      checkCollision(skierPosition.x, skierPosition.y, obstacle)
    );

    if (collision) {
      endGame();
      return;
    }

    // Check for dodged obstacles and add score
    const processedObstacles = updatedObstacles.map((obstacle) => {
      if (!obstacle.passed && obstacle.y < skierPosition.y - SKIER_SIZE) {
        addScore(10);
        return { ...obstacle, passed: true };
      }
      return obstacle;
    });

    updateObstacles(processedObstacles);

    // Gradually increase game speed
    setGameSpeed((prev: number) => Math.min(prev + 0.001, 3));
  }, [obstacles, gameSpeed, skierPosition, updateObstacles, setGameSpeed, addScore, endGame]);

  return { spawnObstacle, updateGame };
};

// Mountain selection hook
export const useMountainSelection = () => {
  const { setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, 
          setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears } = useAppStore();

  const selectMountain = useCallback((mountain: any) => {
    setCurrentTree(mountain.trees > 0 ? { index: 1, type: "Pine" } : { index: 0, type: "None" });
    setCurrentJerry(mountain.jerries > 0 ? { index: 1, type: "Kevin" } : { index: 0, type: "None" });
    setCurrentMogul(mountain.moguls > 0 ? { index: 1, type: "low" } : { index: 0, type: "none" });
    setCurrentBear(mountain.bears > 0 ? { index: 1, type: "Brown" } : { index: 0, type: "None" });
    setNumberOfTrees(mountain.trees);
    setNumberOfJerries(mountain.jerries);
    setNumberOfMoguls(mountain.moguls);
    setNumberOfBears(mountain.bears);
  }, [setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, 
      setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears]);

  return { selectMountain };
};