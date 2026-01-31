import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import GameScreen from "../game/gameScreen";
import { useAppStore, Views } from "../hooks/game-state";

export default function GameScreenWrapper() {
  const router = useRouter();
  const { currentView, gameOver } = useAppStore();

  useEffect(() => {
    if (gameOver && currentView === Views.DefeatScreen) {
      router.replace('/defeatScreen');
    }
  }, [gameOver, currentView, router]);

  return <GameScreen />;
}
