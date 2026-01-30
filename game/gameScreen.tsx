import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, PanResponder } from "react-native";
import { useAppStore } from "../hooks/game-state";
import { gameStyles } from "./styles";
import { skierEmoji, jerryEmoji } from "../assets/jerries/jerryArray";
import { SCREEN_WIDTH, SCREEN_HEIGHT, SKIER_SIZE, OBSTACLE_SIZE } from "./types";

export default function GameScreen() {
  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const obstaclesPassedRef = useRef(0);
  const gameStartTimeRef = useRef<number>(0);
  const lastSpeedIncreaseRef = useRef<number>(0);
  
  const { 
    gameStarted, 
    score, 
    skierPosition, 
    obstacles, 
    gameSpeed,
    gameOver,
    currentTree,
    currentJerry,
    currentMogul,
    currentBear,
    startGame,
    stopGame,
    updateSkierPosition,
    addObstacle,
    updateObstacles,
    addScore,
    endGame,
    setGameSpeed,
    currentMountain
  } = useAppStore();

  const getObstacleEmoji = (type: string) => {
    switch (type) {
      case 'tree': return '🌲';
      case 'jerry': return jerryEmoji;
      case 'mogul': return '⛰️';
      case 'bear': return '🐻';
      default: return '❓';
    }
  };

  const generateObstacle = useCallback((): { id: number; type: 'tree' | 'jerry' | 'mogul' | 'bear'; x: number; y: number; passed: boolean } | null => {
    const enabledObstacles: ('tree' | 'jerry' | 'mogul' | 'bear')[] = [];
    
    const maxObstacles = {
      tree: currentMountain.trees,
      jerry: currentMountain.jerries,
      mogul: currentMountain.moguls,
      bear: currentMountain.bears
    };
    
    const currentObstacleCounts = obstacles.reduce((acc, obstacle) => {
      acc[obstacle.type]++;
      return acc;
    }, { tree: 0, jerry: 0, mogul: 0, bear: 0 });
    
    if (currentTree.index > 0 && currentObstacleCounts.tree < maxObstacles.tree) {
      enabledObstacles.push('tree');
    }
    if (currentJerry.index > 0 && currentObstacleCounts.jerry < maxObstacles.jerry) {
      enabledObstacles.push('jerry');
    }
    if (currentMogul.index > 0 && currentObstacleCounts.mogul < maxObstacles.mogul) {
      enabledObstacles.push('mogul');
    }
    if (currentBear.index > 0 && currentObstacleCounts.bear < maxObstacles.bear) {
      enabledObstacles.push('bear');
    }
    
    if (enabledObstacles.length === 0) return null;
    
    const type = enabledObstacles[Math.floor(Math.random() * enabledObstacles.length)];
    const x = Math.random() * (SCREEN_WIDTH - OBSTACLE_SIZE);
    
    return {
      id: obstacleIdRef.current++,
      type,
      x,
      y: SCREEN_HEIGHT,
      passed: false
    };
  }, [currentTree, currentJerry, currentMogul, currentBear, currentMountain, obstacles]);

  const checkCollision = useCallback((skierPos: any, obstacle: any) => {
    const skierLeft = skierPos.x;
    const skierRight = skierPos.x + SKIER_SIZE;
    const skierTop = skierPos.y;
    const skierBottom = skierPos.y + SKIER_SIZE;
    
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + OBSTACLE_SIZE;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + OBSTACLE_SIZE;
    
    return !(
      skierLeft > obstacleRight ||
      skierRight < obstacleLeft ||
      skierTop > obstacleBottom ||
      skierBottom < obstacleTop
    );
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;
    
    // Check for time-based speed increase every 10 seconds
    const currentTime = Date.now();
    const timeElapsed = currentTime - gameStartTimeRef.current;
    const timeSinceLastIncrease = currentTime - lastSpeedIncreaseRef.current;
    
    if (timeSinceLastIncrease >= 10000) { // 10 seconds = 10000ms
      setGameSpeed((prev: number) => Math.min(prev * 1.1, 5)); // 10% increase
      lastSpeedIncreaseRef.current = currentTime;
    }
    
    updateObstacles(obstacles.map(obstacle => {
      const newY = obstacle.y - gameSpeed;
      
      if (newY < -OBSTACLE_SIZE) {
        if (!obstacle.passed) {
          addScore(10);
          obstaclesPassedRef.current++;
          
          // Keep obstacle-based speed increase as well
          if (obstaclesPassedRef.current % 10 === 0) {
            setGameSpeed((prev: number) => Math.min(prev + 0.2, 5));
          }
        }
        return null;
      }
      
      const updatedObstacle = { ...obstacle, y: newY };
      
      if (!obstacle.passed && newY < skierPosition.y - SKIER_SIZE) {
        updatedObstacle.passed = true;
        addScore(10);
        obstaclesPassedRef.current++;
        
        // Keep obstacle-based speed increase as well
        if (obstaclesPassedRef.current % 10 === 0) {
          setGameSpeed((prev: number) => Math.min(prev + 0.2, 5));
        }
      }
      
      if (checkCollision(skierPosition, updatedObstacle)) {
        endGame();
        return null;
      }
      
      return updatedObstacle;
    }).filter(Boolean));
    
    if (Math.random() < 0.02) {
      const newObstacle = generateObstacle();
      if (newObstacle) {
        newObstacle.y = SCREEN_HEIGHT;
        addObstacle(newObstacle);
      }
    }
  }, [gameStarted, gameOver, obstacles, gameSpeed, skierPosition, updateObstacles, addScore, addObstacle, generateObstacle, checkCollision, endGame, setGameSpeed]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      if (gameStartTimeRef.current === 0) {
        gameStartTimeRef.current = Date.now();
        lastSpeedIncreaseRef.current = Date.now();
      }
      
      const interval = setInterval(gameLoop, 16);
      gameLoopRef.current = interval;
      return () => clearInterval(interval);
    } else if (!gameStarted) {
      gameStartTimeRef.current = 0;
      lastSpeedIncreaseRef.current = 0;
    }
  }, [gameStarted, gameOver, gameLoop]);

  const handleTouch = useCallback((evt: any) => {
    if (!gameStarted || gameOver) return;
    
    const { locationX, locationY } = evt.nativeEvent;
    const step = 30;
    let newX = skierPosition.x;
    let newY = skierPosition.y;
    
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;
    
    if (locationX < centerX - 50) {
      newX = Math.max(0, skierPosition.x - step);
    } else if (locationX > centerX + 50) {
      newX = Math.min(SCREEN_WIDTH - SKIER_SIZE, skierPosition.x + step);
    }
    
    if (locationY < centerY - 50) {
      newY = Math.max(100, skierPosition.y - step);
    } else if (locationY > centerY + 50) {
      newY = Math.min(SCREEN_HEIGHT - SKIER_SIZE - 100, skierPosition.y + step);
    }
    
    updateSkierPosition({ x: newX, y: newY });
  }, [gameStarted, gameOver, skierPosition, updateSkierPosition]);

  const handleStartGame = () => {
    startGame();
  };

  const handleStopGame = () => {
    Alert.alert(
      "Stop Game",
      "Are you sure you want to stop the game?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Stop", 
          style: "destructive",
          onPress: stopGame 
        }
      ]
    );
  };

  if (gameOver) {
    return (
      <View style={gameStyles.container}>
        <Text style={{ fontSize: 24, color: 'white', textAlign: 'center', marginTop: 100 }}>
          Game Over!
        </Text>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center', marginTop: 20 }}>
          Final Score: {score}
        </Text>
        <TouchableOpacity 
          style={[gameStyles.startButton, { alignSelf: 'center', marginTop: 30 }]}
          onPress={handleStartGame}
        >
          <Text style={gameStyles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={gameStyles.container}>
      <View style={gameStyles.header}>
        <Text style={gameStyles.score}>Score: {score}</Text>
        <Text style={gameStyles.speed}>Speed: {gameSpeed.toFixed(1)}</Text>
      </View>
      
      <TouchableOpacity 
        style={gameStyles.gameArea}
        onPress={handleTouch}
        activeOpacity={1}
      >
        {gameStarted && (
          <>
            <View style={[gameStyles.skier, { left: skierPosition.x, top: skierPosition.y }]}>
              <Text style={gameStyles.skierEmoji}>{skierEmoji}</Text>
            </View>
            
            {obstacles.map(obstacle => (
              <View 
                key={obstacle.id} 
                style={[gameStyles.obstacle, { left: obstacle.x, top: obstacle.y }]}
              >
                <Text style={gameStyles.obstacleEmoji}>{getObstacleEmoji(obstacle.type)}</Text>
              </View>
            ))}
          </>
        )}
      </TouchableOpacity>
      
      <View style={gameStyles.controls}>
        {!gameStarted ? (
          <TouchableOpacity style={gameStyles.startButton} onPress={handleStartGame}>
            <Text style={gameStyles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <View style={gameStyles.instructions}>
            <Text style={gameStyles.instructionText}>Tap anywhere on the game area to move</Text>
          </View>
        )}
        
        {gameStarted && (
          <TouchableOpacity style={gameStyles.stopButton} onPress={handleStopGame}>
            <Text style={gameStyles.buttonText}>Stop Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}