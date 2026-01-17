import { Image } from "expo-image";
import { Alert, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import Link from "expo-router/link";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const handleStartGame = () => {
    Alert.alert("Start Game", "Game feature coming soon!");
  };



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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">MapleSki</ThemedText>
          <ThemedText style={styles.subtitle}>Hit the Slopes!</ThemedText>
        </ThemedView>

        <ThemedView style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: tintColor }]}
            onPress={handleStartGame}
          >
            <ThemedText style={[styles.menuButtonText, { color: "#fff" }]}>
              Start Game
            </ThemedText>
          </TouchableOpacity>

          <Link href="/options" asChild>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: textColor, opacity: 0.8 },
              ]}
            >
              <ThemedText
                style={[styles.menuButtonText, { color: backgroundColor }]}
              >
                Game Options
              </ThemedText>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.menuButton, styles.exitButton]}
            onPress={handleExit}
          >
            <ThemedText style={[styles.menuButtonText, { color: "#fff" }]}>
              Exit
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
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
    gap: 20,
  },
  menuButton: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exitButton: {
    backgroundColor: "#dc3545",
  },
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
