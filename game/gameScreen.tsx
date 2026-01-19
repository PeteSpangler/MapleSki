import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import {
  OBSTACLE_SIZE,
  Obstacle,
  Position,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SKIER_SIZE,
} from "../game/types";
import { useAppStore } from "../hooks/game-state";
import { useGameControls, useObstacleSpawner } from "./hooks";
import { gameStyles } from "./styles";

export default function GameScreen() {
  const { currentTree, currentJerry, currentMogul, currentBear } =
    useAppStore();

  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const skierXRef = useRef(
    new Animated.Value(SCREEN_WIDTH / 2 - SKIER_SIZE / 2),
  ).current;
  const skierYRef = useRef(new Animated.Value(SCREEN_HEIGHT * 0.3)).current;
  const [skierPosition, setSkierPosition] = useState<Position>({
    x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2,
    y: SCREEN_HEIGHT * 0.3,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(2);

  const gameLoopRef = useRef<any>(null);
  const obstacleSpawnRef = useRef<any>(null);
  const scoreRef = useRef(0);

  const { moveSkierLeft, moveSkierRight } = useGameControls(gameStarted);
  const { spawnObstacle } = useObstacleSpawner(gameStarted);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setScore(0);
    scoreRef.current = 0;
    setSkierPosition({
      x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2,
      y: SCREEN_HEIGHT * 0.3,
    });
    setObstacles([]);
    setGameSpeed(2);
  }, []);

  const stopGame = useCallback(() => {
    setGameStarted(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (obstacleSpawnRef.current) {
      clearInterval(obstacleSpawnRef.current);
    }
  }, []);

  const handleSkierMove = useCallback(
    (action: { type: "left" | "right"; x: number }) => {
      if (!gameStarted) return;
      setSkierPosition((prev) => {
        const newX =
          action.type === "left"
            ? Math.max(0, prev.x + action.x)
            : Math.min(SCREEN_WIDTH - SKIER_SIZE, prev.x + action.x);
        Animated.timing(skierXRef, {
          toValue: newX,
          duration: 0,
          useNativeDriver: false,
        }).start();
        return { ...prev, x: newX };
      });
    },
    [gameStarted, skierXRef],
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
            if (!obstacle.passed && obstacle.y < skierPosition.y) {
              obstacle.passed = true;
              scoreRef.current += 10;
              setScore(scoreRef.current);
            }
          });

          return updated;
        });

        setGameSpeed((prev) => Math.min(prev + 0.02, 10));
      }, 16); // ~60 FPS

      obstacleSpawnRef.current = setInterval(() => {
        const newObstacle = spawnObstacle();
        if (newObstacle) {
          setObstacles((prev) => [...prev, newObstacle]);
        }
      }, 1500);

      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
      };
    }
  }, [gameStarted, gameSpeed, spawnObstacle, skierXRef, skierYRef]);

  return (
    <View style={gameStyles.container}>
      <View style={gameStyles.header}>
        <Text style={gameStyles.score}>Score: {score}</Text>
        <Text style={gameStyles.speed}>Speed: {gameSpeed.toFixed(1)}</Text>
      </View>

      <View style={gameStyles.gameArea}>
        <Animated.View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            left: skierXRef,
            top: skierYRef,
            width: SKIER_SIZE,
            height: SKIER_SIZE,
          }}
        >
          <Text style={gameStyles.skierEmoji}>⛷️</Text>
        </Animated.View>

        {obstacles.map((obstacle) => (
          <View
            key={obstacle.id}
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              left: obstacle.x,
              top: obstacle.y,
              width: OBSTACLE_SIZE,
              height: OBSTACLE_SIZE,
            }}
          >
            <Text style={gameStyles.obstacleEmoji}>
              {obstacle.type === "tree" && "🌲"}
              {obstacle.type === "jerry" && "🎿"}
              {obstacle.type === "mogul" && "⛰️"}
              {obstacle.type === "bear" && "🐻"}
            </Text>
          </View>
        ))}
      </View>

      <View style={gameStyles.controls}>
        {!gameStarted ? (
          <TouchableOpacity style={gameStyles.startButton} onPress={startGame}>
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
    </View>
  );
}
