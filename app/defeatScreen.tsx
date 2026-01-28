import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useAppStore, HighScore } from "../hooks/game-state";
import { useThemeColor } from "../hooks/use-theme-color";


export default function DefeatScreen() {
  const { 
    score, 
    highScores, 
    saveHighScore, 
    setCurrentView, 
    resetGame 
  } = useAppStore();

  const [username, setUsername] = useState("");
  const [isHighScore, setIsHighScore] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    // Check if current score qualifies for high scores
    const qualifies = highScores.length < 10 || score > highScores[highScores.length - 1]?.score;
    setIsHighScore(qualifies);
  }, [score, highScores]);

  const handleSaveHighScore = () => {
    if (username.length !== 3) {
      Alert.alert("Invalid Username", "Please enter exactly 3 letters");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(username)) {
      Alert.alert("Invalid Username", "Username must contain only letters");
      return;
    }

    saveHighScore(username, score);
    Alert.alert("High Score Saved!", "Your score has been added to the leaderboard!");
    setUsername("");
  };

  const handlePlayAgain = () => {
    resetGame();
    setCurrentView(0); // Views.Menu
  };

  const renderHighScores = () => {
    if (highScores.length === 0) {
      return (
        <ThemedText style={styles.noScoresText}>
          No high scores yet. Be the first!
        </ThemedText>
      );
    }

    return highScores.map((highScore: HighScore, index: number) => (
      <View key={`${highScore.username}-${highScore.date}`} style={styles.scoreRow}>
        <ThemedText style={[styles.rankText, { color: textColor }]}>
          {index + 1}.
        </ThemedText>
        <ThemedText style={[styles.usernameText, { color: textColor }]}>
          {highScore.username}
        </ThemedText>
        <ThemedText style={[styles.scoreListItemText, { color: textColor }]}>
          {highScore.score}
        </ThemedText>
      </View>
    ));
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Game Over!
        </ThemedText>
        
        <ThemedText style={[styles.currentScoreText, { color: tintColor }]}>
          Your Score: {score}
        </ThemedText>

        {isHighScore && (
          <View style={styles.highScoreEntry}>
            <ThemedText style={styles.highScoreTitle}>
              High Score! Enter Your Name:
            </ThemedText>
            <TextInput
              style={[
                styles.usernameInput,
                { 
                  borderColor: tintColor,
                  color: textColor,
                  backgroundColor: backgroundColor,
                }
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="3 letters"
              placeholderTextColor="#999"
              maxLength={3}
              autoCapitalize="characters"
              textAlign="center"
            />
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleSaveHighScore}
              disabled={username.length !== 3}
            >
              <ThemedText style={styles.buttonText}>Save Score</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.highScoresContainer}>
          <ThemedText type="subtitle" style={styles.highScoresTitle}>
            Top 10 High Scores
          </ThemedText>
          <ScrollView style={styles.scoresList}>
            {renderHighScores()}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.playAgainButton, { backgroundColor: tintColor }]}
            onPress={handlePlayAgain}
          >
            <ThemedText style={styles.buttonText}>Main Menu</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  scoreText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  currentScoreText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  highScoreEntry: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  highScoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  usernameInput: {
    width: 120,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  saveButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  highScoresContainer: {
    flex: 1,
    marginBottom: 20,
  },
  highScoresTitle: {
    textAlign: "center",
    marginBottom: 15,
  },
  scoresList: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scoreListItemText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 80,
    textAlign: "right",
  },
  noScoresText: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    paddingVertical: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  playAgainButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
});