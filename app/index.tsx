import { Image } from "expo-image";
import Link from "expo-router/link";
import { useState } from "react";
import {
  Alert,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "../components/parallax-scroll-view";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useThemeColor } from "../hooks/use-theme-color";

export default function HomeScreen() {
  const [showGameModal, setShowGameModal] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const safeBackgroundColor = backgroundColor || "#fff";
  const safeTextColor = textColor || "#11181C";
  const safeTintColor = tintColor || "#0a7ea4";

  const handleCloseModal = () => {
    setShowGameModal(false);
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
    <>
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
            <Link href="/gameScreen" asChild>
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: safeTintColor }]}
              >
                <ThemedText
                  style={[styles.menuButtonText, { color: "#ffffff" }]}
                >
                  Start Game
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/options" asChild>
              <TouchableOpacity
                style={Object.assign({}, styles.menuButton, {
                  backgroundColor: safeTextColor,
                  opacity: 0.8,
                })}
              >
                <ThemedText
                  style={Object.assign({}, styles.menuButtonText, {
                    color: safeBackgroundColor,
                  })}
                >
                  Game Options
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              style={Object.assign({}, styles.menuButton, styles.exitButton)}
              onPress={handleExit}
            >
              <ThemedText
                style={Object.assign({}, styles.menuButtonText, {
                  color: "#ffffff",
                })}
              >
                Exit
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>

      <Modal
        visible={showGameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView
            style={Object.assign({}, styles.modalContent, {
              backgroundColor: safeBackgroundColor,
            })}
          >
            <ThemedText type="title" style={styles.modalTitle}>
              Game Coming Soon!
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              The skiing game is currently under development. Check back later
              for updates!
            </ThemedText>
            <TouchableOpacity
              style={Object.assign({}, styles.modalButton, {
                backgroundColor: safeTintColor,
              })}
              onPress={handleCloseModal}
            >
              <ThemedText
                style={Object.assign({}, styles.modalButtonText, {
                  color: "#ffffff",
                })}
              >
                OK
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
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
    marginBottom: 20,
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
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  modalContent: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    maxWidth: 300,
    width: "100%",
    ...Platform.select({
      ios: {
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
