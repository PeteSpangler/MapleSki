import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { mountainArray } from "../assets/mountains/mountainArray";
import {
  OBSTACLE_SIZE,
  Obstacle,
  Position,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SKIER_SIZE,
} from "../game/types";
import { useAppStore } from "../hooks/game-state";
import {
  useGameControls,
  useMountainSelection,
  useObstacleSpawner,
} from "./hooks";
import { gameStyles } from "./styles";

export default function GameScreen() {
  const { numberOfTrees, numberOfJerries, numberOfMoguls, numberOfBears } =
    useAppStore();

  const [gameStarted, setGameStarted] = useState(false);
  const [showMountainModal, setShowMountainModal] = useState(false);
  const [score, setScore] = useState(0);
  const [skierPosition, setSkierPosition] = useState<Position>({
    x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2,
    y: SCREEN_HEIGHT * 0.3,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [spawnedCounts, setSpawnedCounts] = useState({
    trees: 0,
    jerries: 0,
    moguls: 0,
    bears: 0,
  });

  const gameLoopRef = useRef<any>(null);
  const obstacleSpawnRef = useRef<any>(null);
  const scoreRef = useRef(0);

  const { moveSkierLeft, moveSkierRight } = useGameControls(gameStarted);
  const { spawnObstacle } = useObstacleSpawner(
    gameStarted,
    numberOfTrees > 0,
    numberOfJerries > 0,
    numberOfMoguls > 0,
    numberOfBears > 0,
    spawnedCounts,
    numberOfTrees,
    numberOfJerries,
    numberOfMoguls,
    numberOfBears,
  );

  const { selectMountain } = useMountainSelection();

  const startGame = useCallback(() => {
    setShowMountainModal(true);
  }, []);

  const handleMountainSelect = useCallback(
    (mountain: (typeof mountainArray)[0]) => {
      selectMountain(mountain);
      setSpawnedCounts({ trees: 0, jerries: 0, moguls: 0, bears: 0 });
      setShowMountainModal(false);
      setGameStarted(true);
      setScore(0);
      setSkierPosition({
        x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2,
        y: SCREEN_HEIGHT * 0.3,
      });
      setObstacles([]);
      setGameSpeed(2);
    },
    [selectMountain],
  );

  const handleSkierMove = useCallback(
    (action: { type: "left" | "right"; x: number }) => {
      if (!gameStarted) return;
      setSkierPosition((prev) => {
        const newX =
          action.type === "left"
            ? Math.max(0, prev.x + action.x)
            : Math.min(SCREEN_WIDTH - SKIER_SIZE, prev.x + action.x);
        return { ...prev, x: newX };
      });
    },
    [gameStarted],
  );

  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = setInterval(() => {
        setObstacles((prev) => {
          const updated = prev
            .map((obstacle) => ({
              ...obstacle,
              y: obstacle.y - gameSpeed,
            }))
            .filter((obstacle) => obstacle.y > -OBSTACLE_SIZE);

          updated.forEach((obstacle) => {
            if (
              !obstacle.passed &&
              obstacle.y < skierPosition.y + SKIER_SIZE &&
              obstacle.y > skierPosition.y - SKIER_SIZE
            ) {
              obstacle.passed = true;
              setScore(scoreRef.current + 10);
            }
          });

          return updated.filter((obstacle) => obstacle.y > -OBSTACLE_SIZE);
        });

        setGameSpeed((prev) => Math.min(prev + 0.02, 10));
      }, 16);

      obstacleSpawnRef.current = setInterval(() => {
        const newObstacle = spawnObstacle();
        if (newObstacle) {
          setSpawnedCounts((prev) => ({
            ...prev,
            [newObstacle.type === "tree"
              ? "trees"
              : newObstacle.type === "jerry"
                ? "jerries"
                : newObstacle.type === "mogul"
                  ? "moguls"
                  : "bears"]:
              prev[
                newObstacle.type === "tree"
                  ? "trees"
                  : newObstacle.type === "jerry"
                    ? "jerries"
                    : newObstacle.type === "mogul"
                      ? "moguls"
                      : "bears"
              ] + 1,
          }));
          setObstacles((prev) => [...prev, newObstacle]);
        }
      }, 1500);
    }
  }, [gameStarted, gameSpeed, spawnObstacle, skierPosition]);

  const stopGame = useCallback(() => {
    setGameStarted(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
  }, []);

  return (
    <View style={gameStyles.container}>
      <View style={gameStyles.header}>
        <Text style={gameStyles.score}>Score: {score}</Text>
        <Text style={gameStyles.speed}>Speed: {gameSpeed.toFixed(1)}</Text>
      </View>

      <View style={gameStyles.gameArea}>
        <View
          style={[
            gameStyles.skier,
            {
              left: skierPosition.x,
              top: skierPosition.y,
            },
          ]}
        >
          <Text style={gameStyles.skierEmoji}>⛷️</Text>
        </View>

        {obstacles.map((obstacle) => (
          <View
            key={obstacle.id}
            style={[
              gameStyles.obstacle,
              {
                left: obstacle.x,
                top: obstacle.y,
              },
            ]}
          >
            <Text style={gameStyles.obstacleEmoji}>
              {obstacle.type === "tree" && "🌲"}
              {obstacle.type === "jerry" && "🎿"}
              {obstacle.type === "mogul" && "⛰️"}
              {obstacle.type === "bear" && "🐻"}
            </Text>
          </View>
        ))}

        <View style={gameStyles.controls}>
          {!gameStarted ? (
            <TouchableOpacity
              style={gameStyles.startButton}
              onPress={startGame}
            >
              <Text style={gameStyles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          ) : (
            <View style={gameStyles.gameControls}>
              <TouchableOpacity
                style={gameStyles.controlButton}
                onPress={() => {
                  const move = moveSkierLeft();
                  if (move) handleSkierMove(move);
                }}
              >
                <Text style={gameStyles.buttonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={gameStyles.controlButton}
                onPress={stopGame}
              >
                <Text style={gameStyles.buttonText}>Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={gameStyles.controlButton}
                onPress={() => {
                  const move = moveSkierRight();
                  if (move) handleSkierMove(move);
                }}
              >
                <Text style={gameStyles.buttonText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={gameStyles.instructions}>
          <Text style={gameStyles.instructionText}>
            Use touch controls to move left and right
          </Text>
        </View>

        {showMountainModal && (
          <View style={gameStyles.modalOverlay}>
            <View style={gameStyles.modalContent}>
              <Text style={gameStyles.modalTitle}>Select Mountain</Text>
              <View style={gameStyles.mountainList}>
                {mountainArray.map((mountain) => (
                  <TouchableOpacity
                    key={mountain.index}
                    style={gameStyles.mountainItem}
                    onPress={() => handleMountainSelect(mountain)}
                  >
                    <View>
                      <Text style={gameStyles.mountainName}>
                        {mountain.name}
                      </Text>
                      <Text style={gameStyles.mountainDesc}>
                        {mountain.desc}
                      </Text>
                      <View style={gameStyles.obstaclePreview}>
                        <Text style={gameStyles.obstacleText}>
                          🌲 {mountain.trees} | 🎿 {mountain.jerries} | ⛰️{" "}
                          {mountain.moguls} | 🐻 {mountain.bears}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={gameStyles.cancelButton}
                onPress={() => setShowMountainModal(false)}
              >
                <Text style={gameStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
