import { useRouter } from 'expo-router';
import {
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";
import { Mountain } from "../assets/mountains/mountainArray";
import MountainSelectModal from "../components/mountain-select";
import { useAppStore } from "../hooks/game-state";

export default function HomeScreen() {
  const router = useRouter();
  const [showMountainSelect, setShowMountainSelect] = useState(false);
  const { setCurrentMountain, currentMountain } = useAppStore();

  const handleExit = () => {
    Alert.alert("Exit Game", "Are you sure you want to exit MapleSki?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Exit",
        style: "destructive",
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MapleSki</Text>
          <Text style={styles.subtitle}>Hit the Slopes!</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuButton, styles.startGameButton]}
            onPress={() => router.push('/gameScreen')}
          >
            <Text style={[styles.menuButtonText, { color: "#ffffff" }]}>
              Start Game
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: "#6495ED" }]}
            onPress={() => setShowMountainSelect(true)}
          >
            <Text style={[styles.menuButtonText, { color: "#ffffff" }]}>
              Mountain: {currentMountain.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.exitButton]}
            onPress={handleExit}
          >
            <Text style={[styles.menuButtonText, { color: "#ffffff" }]}>
              Exit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <MountainSelectModal
        visible={showMountainSelect}
        onClose={() => setShowMountainSelect(false)}
        onSelect={(mountain: Mountain) => setCurrentMountain(mountain)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#87CEEB",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
    color: "#ffffff",
  },
  menuContainer: {
    width: "100%",
    maxWidth: 300,
  },
  menuButton: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    marginBottom: 30,
    ...Platform.select({
      ios: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exitButton: {
    backgroundColor: "#dc3545",
  },
  startGameButton: {
    backgroundColor: "#4CAF50",
  },
});