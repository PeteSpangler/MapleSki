import { Platform, StyleSheet } from "react-native";

export const gameStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  speed: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skier: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  skierEmoji: {
    fontSize: 30,
  },
  obstacle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacleEmoji: {
    fontSize: 20,
  },
  controls: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  gameControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 60,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  mountainList: {
    maxHeight: 350,
  },
  mountainItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mountainInfo: {
    gap: 5,
  },
  mountainName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mountainDesc: {
    fontSize: 14,
    color: "#666",
  },
  obstaclePreview: {
    marginTop: 5,
  },
  obstacleText: {
    fontSize: 12,
    color: "#444",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
});