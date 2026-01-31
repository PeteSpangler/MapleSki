import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAppStore } from "../hooks/game-state";
import { gameStyles } from "./styles";
import { OBSTACLE_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, SKIER_SIZE } from "./types";

const SKIER_EMOJI = "⛷️";
const JERRY_EMOJI = "🐢";

export default function GameScreen() {
  const gameLoopRef = useRef<number>(0);
  const obstacleIdRef = useRef(0);
  const obstaclesPassedRef = useRef(0);
  const gameStartTimeRef = useRef<number>(0);
  const lastSpeedIncreaseRef = useRef<number>(0);
  const lastObstacleSpawnRef = useRef<number>(0);
  const lastLimitIncreaseRef = useRef<number>(0);
  const [skierFacing, setSkierFacing] = useState<'left' | 'right'>('right');
  
  const { 
    gameStarted, 
    score, 
    skierPosition, 
    obstacles, 
    gameSpeed,
    gameOver,
    dynamicObstacleLimits,
    startGame,
    stopGame,
    updateSkierPosition,
    addObstacle,
    updateObstacles,
    addScore,
    endGame,
    setGameSpeed,
    setDynamicObstacleLimits,
    currentMountain
  } = useAppStore();

  const getObstacleEmoji = (type: string) => {
    switch (type) {
      case 'tree': return '🌲';
      case 'jerry': return JERRY_EMOJI;
      case 'mogul': return '⛰️';
      case 'bear': return '🐻';
      case 'snowman': return '☃️';
      default: return '❓';
    }
  };

  const generateObstacle = useCallback((forceType?: 'tree' | 'jerry' | 'mogul' | 'bear' | 'snowman'): { id: number; type: 'tree' | 'jerry' | 'mogul' | 'bear' | 'snowman'; x: number; y: number; passed: boolean } | null => {
    const enabledObstacles: ('tree' | 'jerry' | 'mogul' | 'bear' | 'snowman')[] = [];
    
    const maxObstacles = {
      tree: dynamicObstacleLimits.trees,
      jerry: dynamicObstacleLimits.jerries,
      mogul: dynamicObstacleLimits.moguls,
      bear: dynamicObstacleLimits.bears,
      snowman: 1
    };
    
    const currentObstacleCounts = obstacles.reduce((acc, obstacle) => {
      acc[obstacle.type]++;
      return acc;
    }, { tree: 0, jerry: 0, mogul: 0, bear: 0, snowman: 0 });
    
    if (currentObstacleCounts.tree < maxObstacles.tree) {
      enabledObstacles.push('tree');
    }
    if (currentObstacleCounts.jerry < maxObstacles.jerry) {
      enabledObstacles.push('jerry');
    }
    if (currentObstacleCounts.mogul < maxObstacles.mogul) {
      enabledObstacles.push('mogul');
    }
    if (currentObstacleCounts.bear < maxObstacles.bear) {
      enabledObstacles.push('bear');
    }
    
    if (forceType === 'snowman' || (score >= 500 && currentObstacleCounts.snowman < maxObstacles.snowman)) {
      enabledObstacles.push('snowman');
    }
    
    if (enabledObstacles.length === 0) return null;
    
    const type = forceType || enabledObstacles[Math.floor(Math.random() * enabledObstacles.length)];
    const x = Math.random() * (SCREEN_WIDTH - OBSTACLE_SIZE);
    
    return {
      id: obstacleIdRef.current++,
      type,
      x,
      y: SCREEN_HEIGHT,
      passed: false
    };
  }, [dynamicObstacleLimits, currentMountain, obstacles, score]);

  const checkCollision = useCallback((skierPos: any, obstacle: any) => {
    const skierLeft = skierPos.x;
    const skierRight = skierPos.x + SKIER_SIZE;
    const skierTop = skierPos.y;
    const skierBottom = skierPos.y + SKIER_SIZE;
    
    // Use larger collision box for snowman
    const obstacleSize = obstacle.type === 'snowman' ? OBSTACLE_SIZE * 2 : OBSTACLE_SIZE;
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + obstacleSize;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + obstacleSize;
    
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
    const timeSinceLastSpeedIncrease = currentTime - lastSpeedIncreaseRef.current;
    
    if (timeSinceLastSpeedIncrease >= 5000) {
      setGameSpeed((prev: number) => Math.min(prev * 1.2, 25));
      lastSpeedIncreaseRef.current = currentTime;
    }
    
    // Spawn 1 of each obstacle every 3 seconds (reduced from 10 seconds)
    const timeSinceLastSpawn = currentTime - lastObstacleSpawnRef.current;
    if (timeSinceLastSpawn >= 3000) {
      const obstacleTypes: ('tree' | 'jerry' | 'mogul' | 'bear')[] = ['tree', 'jerry', 'mogul', 'bear'];
      obstacleTypes.forEach(type => {
        const obstacle = generateObstacle(type);
        if (obstacle) {
          addObstacle(obstacle);
        }
      });
      lastObstacleSpawnRef.current = currentTime;
    }
    
    // Increase obstacle limits every 5 seconds
    const timeSinceLastLimitIncrease = currentTime - lastLimitIncreaseRef.current;
    if (timeSinceLastLimitIncrease >= 5000) {
      setDynamicObstacleLimits({
        trees: Math.min(dynamicObstacleLimits.trees + 1, currentMountain.trees),
        jerries: Math.min(dynamicObstacleLimits.jerries + 1, currentMountain.jerries),
        moguls: Math.min(dynamicObstacleLimits.moguls + 1, currentMountain.moguls),
        bears: Math.min(dynamicObstacleLimits.bears + 1, currentMountain.bears)
      });
      lastLimitIncreaseRef.current = currentTime;
    }
    
    // Spawn abdominal snowman when score reaches 500
    if (score >= 500) {
      const snowmanExists = obstacles.some(obs => obs.type === 'snowman');
      if (!snowmanExists) {
        // Force-create snowman without going through generateObstacle to avoid mountain restrictions
        const snowman = {
          id: obstacleIdRef.current++,
          type: 'snowman' as const,
          x: skierPosition.x,
          y: -OBSTACLE_SIZE * 2, // Start further up to be visible
          passed: false
        };
        addObstacle(snowman);
      }
    }
    
    updateObstacles(obstacles.map(obstacle => {
      let newY = obstacle.y - gameSpeed;
      let newX = obstacle.x;
      
      // Snowman moves faster and chases the skier
      if (obstacle.type === 'snowman') {
        newY = obstacle.y - (gameSpeed * 1.5); // 50% faster than regular obstacles
        // Mirror skier movements more aggressively
        const dx = skierPosition.x - obstacle.x;
        const chaseSpeed = 3; // Faster horizontal movement
        newX = obstacle.x + Math.sign(dx) * Math.min(Math.abs(dx), chaseSpeed);
      }
      
      if (newY < -OBSTACLE_SIZE) {
        if (!obstacle.passed) {
          const points = gameSpeed >= 25 ? 50 : gameSpeed >= 15 ? 25 : 10;
          addScore(points);
          obstaclesPassedRef.current++;
          
          if (obstaclesPassedRef.current % 10 === 0) {
            setGameSpeed((prev: number) => Math.min(prev + 0.2, 25));
          }
        }
        return null;
      }
      
      const updatedObstacle = { ...obstacle, y: newY, x: newX };
      
      if (!obstacle.passed && newY < skierPosition.y - SKIER_SIZE) {
        updatedObstacle.passed = true;
        const points = gameSpeed >= 25 ? 50 : gameSpeed >= 15 ? 25 : 10;
        addScore(points);
        obstaclesPassedRef.current++;
        
        if (obstaclesPassedRef.current % 10 === 0) {
          setGameSpeed((prev: number) => Math.min(prev + 0.2, 25));
        }
      }
      
      if (checkCollision(skierPosition, updatedObstacle)) {
        // If hit by snowman, special message
        if (updatedObstacle.type === 'snowman') {
          // Game ends immediately when caught by snowman
          endGame();
        } else {
          endGame();
        }
        return null;
      }
      
      return updatedObstacle;
    }).filter(Boolean));
    
    if (Math.random() < 0.08) { // Increased from 2% to 8% chance per frame
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
        lastObstacleSpawnRef.current = Date.now();
        lastLimitIncreaseRef.current = Date.now();
      }
      
      const interval = setInterval(gameLoop, 16);
      gameLoopRef.current = interval;
      return () => clearInterval(interval);
    } else if (!gameStarted) {
      gameStartTimeRef.current = 0;
      lastSpeedIncreaseRef.current = 0;
      lastObstacleSpawnRef.current = 0;
      lastLimitIncreaseRef.current = 0;
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
      setSkierFacing('right');
    } else if (locationX > centerX + 50) {
      newX = Math.min(SCREEN_WIDTH - SKIER_SIZE, skierPosition.x + step);
      setSkierFacing('left');
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
            {/* Left side trees */}
            <View style={[gameStyles.sideTreesContainer, gameStyles.sideTreesLeft]}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`left-tree-${i}`} style={gameStyles.sideTree}>
                  <Text style={gameStyles.sideTreeEmoji}>🌲</Text>
                </View>
              ))}
            </View>
            
            {/* Right side trees */}
            <View style={[gameStyles.sideTreesContainer, gameStyles.sideTreesRight]}>
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`right-tree-${i}`} style={gameStyles.sideTree}>
                  <Text style={gameStyles.sideTreeEmoji}>🌲</Text>
                </View>
              ))}
            </View>
            
            <View style={[gameStyles.skier, { left: skierPosition.x, top: skierPosition.y }]}>
              <Text style={[gameStyles.skierEmoji, { transform: [{ scaleX: skierFacing === 'left' ? -1 : 1 }] }]}>{SKIER_EMOJI}</Text>
            </View>
            
            {obstacles.map(obstacle => (
              <View 
                key={obstacle.id} 
                style={[
                  obstacle.type === 'snowman' ? gameStyles.snowman : gameStyles.obstacle, 
                  { left: obstacle.x, top: obstacle.y }
                ]}
              >
                <Text style={[
                  gameStyles.obstacleEmoji, 
                  obstacle.type === 'snowman' && { fontSize: 40 } // Bigger emoji for snowman
                ]}>
                  {getObstacleEmoji(obstacle.type)}
                </Text>
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