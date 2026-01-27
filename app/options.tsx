import { StyleSheet, TouchableOpacity } from "react-native";

import { bearArray } from "../assets/bears/bearArray";
import { jerryArray } from "../assets/jerries/jerryArray";
import { mogulArray } from "../assets/moguls/mogulArray";
import { treeArray } from "../assets/trees/treeArray";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useAppStore } from "../hooks/game-state";
import { useThemeColor } from "../hooks/use-theme-color";

export default function GameOptionsScreen() {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  const safeTextColor = textColor || "#11181C";
  const safeBorderColor = borderColor || "#687076";
  const safeTintColor = tintColor || "#0a7ea4";

  const {
    currentBear,
    currentTree,
    currentJerry,
    currentMogul,
    setCurrentBear,
    setCurrentTree,
    setCurrentJerry,
    setCurrentMogul,
  } = useAppStore();

  const handleToggleTrees = () => {
    setCurrentTree(currentTree.index === 0 ? treeArray[1] : treeArray[0]);
  };

  const handleToggleJerries = () => {
    setCurrentJerry(currentJerry.index === 0 ? jerryArray[1] : jerryArray[0]);
  };

  const handleToggleMoguls = () => {
    setCurrentMogul(currentMogul.index === 0 ? mogulArray[1] : mogulArray[0]);
  };

  const handleToggleBears = () => {
    setCurrentBear(currentBear.index === 0 ? bearArray[1] : bearArray[0]);
  };

  const isTreesEnabled = currentTree.index !== 0;
  const isJerriesEnabled = currentJerry.index !== 0;
  const isMogulsEnabled = currentMogul.index !== 0;
  const isBearsEnabled = currentBear.index !== 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Game Options</ThemedText>
        <ThemedText style={styles.subtitle}>
          Toggle game elements on or off
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionRow, { borderColor: safeBorderColor }]}
          onPress={handleToggleTrees}
        >
          <ThemedView style={styles.optionInfo}>
            <ThemedText style={styles.optionTitle}>Trees</ThemedText>
            <ThemedText style={styles.optionDescription}>
              {isTreesEnabled ? currentTree.type : "No trees"}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.toggleButton, { backgroundColor: isTreesEnabled ? safeTintColor : safeBorderColor }]}
          >
            <ThemedText
              style={[styles.toggleText, { color: isTreesEnabled ? "#ffffff" : safeTextColor }]}
            >
              {isTreesEnabled ? "ON" : "OFF"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { borderColor: safeBorderColor }]}
          onPress={handleToggleJerries}
        >
          <ThemedView style={styles.optionInfo}>
            <ThemedText style={styles.optionTitle}>Jerries</ThemedText>
            <ThemedText style={styles.optionDescription}>
              {isJerriesEnabled ? currentJerry.type : "No skiers"}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.toggleButton, { backgroundColor: isJerriesEnabled ? safeTintColor : safeBorderColor }]}
          >
            <ThemedText
              style={[styles.toggleText, { color: isJerriesEnabled ? "#ffffff" : safeTextColor }]}
            >
              {isJerriesEnabled ? "ON" : "OFF"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { borderColor: safeBorderColor }]}
          onPress={handleToggleMoguls}
        >
          <ThemedView style={styles.optionInfo}>
            <ThemedText style={styles.optionTitle}>Moguls</ThemedText>
            <ThemedText style={styles.optionDescription}>
              {isMogulsEnabled ? currentMogul.type : "No moguls"}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.toggleButton, { backgroundColor: isMogulsEnabled ? safeTintColor : safeBorderColor }]}
          >
            <ThemedText
              style={[styles.toggleText, { color: isMogulsEnabled ? "#ffffff" : safeTextColor }]}
            >
              {isMogulsEnabled ? "ON" : "OFF"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { borderColor: safeBorderColor }]}
          onPress={handleToggleBears}
        >
          <ThemedView style={styles.optionInfo}>
            <ThemedText style={styles.optionTitle}>Bears</ThemedText>
            <ThemedText style={styles.optionDescription}>
              {isBearsEnabled ? currentBear.type : "No bears"}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.toggleButton, { backgroundColor: isBearsEnabled ? safeTintColor : safeBorderColor }]}
          >
            <ThemedText
              style={[styles.toggleText, { color: isBearsEnabled ? "#ffffff" : safeTextColor }]}
            >
              {isBearsEnabled ? "ON" : "OFF"}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  optionsContainer: {
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});