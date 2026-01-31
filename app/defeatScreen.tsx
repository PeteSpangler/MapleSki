import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { HighScore, useAppStore, Views } from "../hooks/game-state";
import { useThemeColor } from "../hooks/use-theme-color";


export default function DefeatScreen() {
  const router = useRouter();
  const { 
    score, 
    highScores, 
    saveHighScore, 
    setCurrentView, 
    resetGame,
    loadHighScores
  } = useAppStore();

  const [username, setUsername] = useState("");
  const [isHighScore, setIsHighScore] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  useEffect(() => {
    const qualifies = highScores.length < 10 || score > highScores[highScores.length - 1]?.score;
    setIsHighScore(qualifies);
  }, [score, highScores]);

  const handleSaveHighScore = () => {
    if (username.trim().length !== 3) {
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
    
    // Auto-return to main menu after saving
    setTimeout(() => {
      resetGame();
      setCurrentView(Views.Menu);
      router.replace('/');
    }, 1500);
  };

  const handlePlayAgain = () => {
    resetGame();
    setCurrentView(Views.Menu);
    router.replace('/');
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
              style={[styles.saveButton, { backgroundColor: "#4CAF50" }]}
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
            style={[styles.playAgainButton, { backgroundColor: "#dc3545" }]}
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
    marginTop: 60,
  },
  scoreText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#ffffff",
  },
  currentScoreText: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#4CAF50",
  },
  highScoreEntry: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  highScoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#ffffff",
  },
  usernameInput: {
    width: 120,
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ffffff",
    textAlign: "center",
  },
  saveButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
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
    color: "#ffffff",
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
    borderBottomColor: "#444",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
    color: "#ffffff",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  scoreListItemText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 80,
    textAlign: "right",
    color: "#ffffff",
  },
  noScoresText: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    paddingVertical: 20,
    color: "#ffffff",
  },
  buttonContainer: {
    alignItems: "center",
  },
  playAgainButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 150,
  },
});