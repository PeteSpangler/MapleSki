import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { mountainArray } from "../assets/mountains/mountainArray";
import { treeArray } from "../assets/trees/treeArray";
import { jerryArray } from "../assets/jerries/jerryArray";
import { mogulArray } from "../assets/moguls/mogulArray";
import { bearArray } from "../assets/bears/bearArray";
import { useAppStore } from "../hooks/game-state";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SKIER_SIZE = 40;
const OBSTACLE_SIZE = 30;

interface Obstacle {
  id: number;
  type: "tree" | "jerry" | "mogul" | "bear";
  x: number;
  y: number;
  passed: boolean;
}

interface Position {
  x: number;
  y: number;
}

export default function GameScreen() {
  const { setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears, numberOfTrees, numberOfJerries, numberOfMoguls, numberOfBears } =
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
  const [spawnedCounts, setSpawnedCounts] = useState({ trees: 0, jerries: 0, moguls: 0, bears: 0 });

  const gameLoopRef = useRef<any>(null);
  const obstacleSpawnRef = useRef<any>(null);
  const scoreRef = useRef(0);

  const shouldSpawnTrees = numberOfTrees > 0 && spawnedCounts.trees < numberOfTrees;
  const shouldSpawnJerries = numberOfJerries > 0 && spawnedCounts.jerries < numberOfJerries;
  const shouldSpawnMoguls = numberOfMoguls > 0 && spawnedCounts.moguls < numberOfMoguls;
  const shouldSpawnBears = numberOfBears > 0 && spawnedCounts.bears < numberOfBears;

  const startGame = useCallback(() => {
    setShowMountainModal(true);
  }, []);

  const selectMountain = useCallback((mountain: typeof mountainArray[0]) => {
    setCurrentTree(mountain.trees > 0 ? treeArray[1] : treeArray[0]);
    setCurrentJerry(mountain.jerries > 0 ? jerryArray[1] : jerryArray[0]);
    setCurrentMogul(mountain.moguls > 0 ? mogulArray[1] : mogulArray[0]);
    setCurrentBear(mountain.bears > 0 ? bearArray[1] : bearArray[0]);
    setNumberOfTrees(mountain.trees);
    setNumberOfJerries(mountain.jerries);
    setNumberOfMoguls(mountain.moguls);
    setNumberOfBears(mountain.bears);
    setSpawnedCounts({ trees: 0, jerries: 0, moguls: 0, bears: 0 });
    setShowMountainModal(false);
    setGameStarted(true);
    setScore(0);
    scoreRef.current = 0;
    setSkierPosition({
      x: SCREEN_WIDTH / 2 - SKIER_SIZE / 2,
      y: SCREEN_HEIGHT * 0.3,
    });
    setObstacles([]);
    setGameSpeed(2);
  }, [setCurrentTree, setCurrentJerry, setCurrentMogul, setCurrentBear, setNumberOfTrees, setNumberOfJerries, setNumberOfMoguls, setNumberOfBears]);

  const stopGame = useCallback(() => {
    setGameStarted(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (obstacleSpawnRef.current) {
      clearInterval(obstacleSpawnRef.current);
    }
  }, []);

  const moveSkierLeft = useCallback(() => {
    if (!gameStarted) return;
    setSkierPosition((prev) => ({
      ...prev,
      x: Math.max(0, prev.x - 25),
    }));
  }, [gameStarted]);

  const moveSkierRight = useCallback(() => {
    if (!gameStarted) return;
    setSkierPosition((prev) => ({
      ...prev,
      x: Math.min(SCREEN_WIDTH - SKIER_SIZE, prev.x + 25),
    }));
  }, [gameStarted]);

  const spawnObstacle = useCallback(() => {
    if (!gameStarted) return;

    const availableObstacles: ("tree" | "jerry" | "mogul" | "bear")[] = [];
    if (shouldSpawnTrees) availableObstacles.push("tree");
    if (shouldSpawnJerries) availableObstacles.push("jerry");
    if (shouldSpawnMoguls) availableObstacles.push("mogul");
    if (shouldSpawnBears) availableObstacles.push("bear");

    if (availableObstacles.length === 0) return;

    const type =
      availableObstacles[Math.floor(Math.random() * availableObstacles.length)];
    const newObstacle: Obstacle = {
      id: Date.now() + Math.random(),
      type: type,
      x: Math.random() * (SCREEN_WIDTH - OBSTACLE_SIZE),
      y: SCREEN_HEIGHT,
      passed: false,
    };

    setSpawnedCounts((prev) => ({
      ...prev,
      [type === "tree" ? "trees" : type === "jerry" ? "jerries" : type === "mogul" ? "moguls" : "bears"]:
        prev[type === "tree" ? "trees" : type === "jerry" ? "jerries" : type === "mogul" ? "moguls" : "bears"] + 1,
    }));
    setObstacles((prev) => [...prev, newObstacle]);
  }, [
    gameStarted,
    shouldSpawnTrees,
    shouldSpawnJerries,
    shouldSpawnMoguls,
    shouldSpawnBears,
  ]);

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
      }, 16);

      obstacleSpawnRef.current = setInterval(() => {
        spawnObstacle();
      }, 1500);

      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (obstacleSpawnRef.current) clearInterval(obstacleSpawnRef.current);
      };
    }
  }, [gameStarted, gameSpeed, spawnObstacle, skierPosition.y]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.speed}>Speed: {gameSpeed.toFixed(1)}</Text>
      </View>

      <View style={styles.gameArea}>
        <View
          style={[
            styles.skier,
            {
              left: skierPosition.x,
              top: skierPosition.y,
              width: SKIER_SIZE,
              height: SKIER_SIZE,
            },
          ]}
        >
          <Text style={styles.skierEmoji}>⛷️</Text>
        </View>

        {obstacles.map((obstacle) => (
          <View
            key={obstacle.id}
            style={[
              styles.obstacle,
              {
                left: obstacle.x,
                top: obstacle.y,
                width: OBSTACLE_SIZE,
                height: OBSTACLE_SIZE,
              },
            ]}
          >
            <Text style={styles.obstacleEmoji}>
              {obstacle.type === "tree" && "🌲"}
              {obstacle.type === "jerry" && "🎿"}
              {obstacle.type === "mogul" && "⛰️"}
              {obstacle.type === "bear" && "🐻"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        {!gameStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.gameControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={moveSkierLeft}
            >
              <Text style={styles.buttonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={stopGame}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={moveSkierRight}
            >
              <Text style={styles.buttonText}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Use touch controls to move left and right
        </Text>
      </View>

      <Modal
        visible={showMountainModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMountainModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Mountain</Text>
            <ScrollView style={styles.mountainList}>
              {mountainArray.map((mountain) => (
                <TouchableOpacity
                  key={mountain.index}
                  style={styles.mountainItem}
                  onPress={() => selectMountain(mountain)}
                >
                  <View style={styles.mountainInfo}>
                    <Text style={styles.mountainName}>{mountain.name}</Text>
                    <Text style={styles.mountainDesc}>{mountain.desc}</Text>
                    <View style={styles.obstaclePreview}>
                      <Text style={styles.obstacleText}>
                        🌲 {mountain.trees} | 🎿 {mountain.jerries} | ⛰️ {mountain.moguls} | 🐻 {mountain.bears}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowMountainModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
  speed: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gameArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skier: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  skierEmoji: {
    fontSize: 30,
  },
  obstacle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  obstacleEmoji: {
    fontSize: 20,
  },
  controls: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gameControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 60,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructions: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  mountainList: {
    maxHeight: 350,
  },
  mountainItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mountainInfo: {
    gap: 5,
  },
  mountainName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mountainDesc: {
    fontSize: 14,
    color: "#666",
  },
  obstaclePreview: {
    marginTop: 5,
  },
  obstacleText: {
    fontSize: 12,
    color: "#444",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
});
