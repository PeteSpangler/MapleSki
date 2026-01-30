import Link from "expo-router/link";
import {
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "../components/parallax-scroll-view";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useThemeColor } from "../hooks/use-theme-color";
import MountainSelectModal from "../components/mountain-select";
import { useState } from "react";
import { useAppStore } from "../hooks/game-state";
import { Mountain } from "../assets/mountains/mountainArray";

export default function HomeScreen() {
  const [showMountainSelect, setShowMountainSelect] = useState(false);
  const { setCurrentMountain, currentMountain } = useAppStore();
  const tintColor = useThemeColor({}, "tint");

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
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <View style={styles.headerImage} />
        }
      >
        <ThemedView style={styles.container}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">MapleSki</ThemedText>
            <ThemedText style={styles.subtitle}>Hit the Slopes!</ThemedText>
          </ThemedView>

          <ThemedView style={styles.menuContainer}>
            <Link href="/gameScreen" asChild>
              <TouchableOpacity
                style={[styles.menuButton, styles.startGameButton]}
              >
                <ThemedText
                  style={[styles.menuButtonText, { color: "#ffffff" }]}
                >
                  Start Game
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: "#6495ED" }]}
              onPress={() => setShowMountainSelect(true)}
            >
              <ThemedText
                style={[styles.menuButtonText, { color: "#ffffff" }]}
              >
                Mountain: {currentMountain.name}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, styles.exitButton]}
              onPress={handleExit}
            >
              <ThemedText
                style={[styles.menuButtonText, { color: "#ffffff" }]}
              >
                Exit
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      
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
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
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
    marginBottom: 30,
    minHeight: 70,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});