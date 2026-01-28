import React from "react";
import { Animated, Text } from "react-native";
import {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { gameStyles } from "../game/styles";
import { Obstacle } from "../game/types";

interface AnimatedObstacleProps {
  obstacle: Obstacle;
}

export default function AnimatedObstacle({ obstacle }: AnimatedObstacleProps) {
  const obstacleY = useSharedValue(obstacle.y);

  const updateObstacleY = React.useMemo(
    () =>
      runOnUI(() => {
        "worklet";
        obstacleY.value = withSpring(obstacle.y, {
          damping: 20,
          stiffness: 100,
        });
      }),
    [obstacle.y, obstacleY],
  );

  React.useEffect(() => {
    updateObstacleY();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obstacle.y]);

  const obstacleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: obstacleY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        gameStyles.obstacle,
        {
          left: obstacle.x,
        },
        obstacleAnimatedStyle,
      ]}
    >
      <Text style={gameStyles.obstacleEmoji}>
        {obstacle.type === "tree" && "🌲"}
        {obstacle.type === "jerry" && "🎿"}
        {obstacle.type === "mogul" && "⛰️"}
        {obstacle.type === "bear" && "🐻"}
      </Text>
    </Animated.View>
  );
}
