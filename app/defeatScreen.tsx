import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';
import { HighScore, useAppStore, Views } from "../hooks/game-state";


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
        <Text style={styles.noScoresText}>
          No high scores yet. Be the first!
        </Text>
      );
    }

    return highScores.map((highScore: HighScore, index: number) => (
      <View key={`${highScore.username}-${highScore.date}`} style={styles.scoreRow}>
        <Text style={[styles.rankText, { color: "#ffffff" }]}>
          {index + 1}.
        </Text>
        <Text style={[styles.usernameText, { color: "#ffffff" }]}>
          {highScore.username}
        </Text>
        <Text style={[styles.scoreListItemText, { color: "#ffffff" }]}>
          {highScore.score}
        </Text>
      </View>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: "#1a1a2e" }]}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Game Over!
        </Text>
        
        <Text style={[styles.currentScoreText, { color: "#4CAF50" }]}>
          Your Score: {score}
        </Text>

        {isHighScore && (
          <View style={styles.highScoreEntry}>
            <Text style={styles.highScoreTitle}>
              High Score! Enter Your Name:
            </Text>
            <TextInput
              style={[
                styles.usernameInput,
                { 
                  borderColor: "#4CAF50",
                  color: "#ffffff",
                  backgroundColor: "#1a1a2e",
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
              <Text style={styles.buttonText}>Save Score</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.highScoresContainer}>
          <Text style={styles.highScoresTitle}>
            Top 10 High Scores
          </Text>
          <ScrollView style={styles.scoresList}>
            {renderHighScores()}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.playAgainButton, { backgroundColor: "#dc3545" }]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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