import React from "react";
import { View, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { mountainArray, Mountain } from "../assets/mountains/mountainArray";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useThemeColor } from "../hooks/use-theme-color";
import { useAppStore } from "../hooks/game-state";

export default function MountainSelectModal({ 
  visible, 
  onClose, 
  onSelect 
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (mountain: Mountain) => void;
}) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  const safeTextColor = textColor || "#11181C";
  const safeBorderColor = borderColor || "#687076";
  const safeTintColor = tintColor || "#0a7ea4";

  const { currentMountain } = useAppStore();

  const handleSelectMountain = (mountain: Mountain) => {
    onSelect(mountain);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { borderColor: safeBorderColor }]}>
          <ThemedText style={styles.modalTitle}>Select Mountain</ThemedText>
          
          <ScrollView style={styles.mountainList} showsVerticalScrollIndicator={false}>
            {mountainArray.map((mountain) => (
              <TouchableOpacity
                key={mountain.index}
                style={[
                  styles.mountainItem,
                  { 
                    backgroundColor: currentMountain.index === mountain.index 
                      ? safeTintColor + '20' 
                      : '#f5f5f5',
                    borderColor: safeBorderColor
                  }
                ]}
                onPress={() => handleSelectMountain(mountain)}
              >
                <ThemedView>
                  <ThemedText style={styles.mountainName}>{mountain.name}</ThemedText>
                  <ThemedText style={styles.mountainDesc}>{mountain.desc}</ThemedText>
                  
                  <View style={styles.obstaclePreview}>
                    <View style={styles.obstacleRow}>
                      <ThemedText style={styles.obstacleText}>
                        🌲 Trees: {mountain.trees}
                      </ThemedText>
                      <ThemedText style={styles.obstacleText}>
                        ⛷️ Skiers: {mountain.jerries}
                      </ThemedText>
                    </View>
                    <View style={styles.obstacleRow}>
                      <ThemedText style={styles.obstacleText}>
                        ⛰️ Moguls: {mountain.moguls}
                      </ThemedText>
                      <ThemedText style={styles.obstacleText}>
                        🐻 Bears: {mountain.bears}
                      </ThemedText>
                    </View>
                  </View>
                  
                  {currentMountain.index === mountain.index && (
                    <ThemedText style={[styles.selectedText, { color: safeTintColor }]}>
                      Currently Selected
                    </ThemedText>
                  )}
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: safeTextColor }]}
            onPress={onClose}
          >
            <ThemedText style={[styles.buttonText, { color: "#ffffff" }]}>
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    maxHeight: '70%',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mountainList: {
    maxHeight: 250,
  },
  mountainItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mountainName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mountainDesc: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  obstaclePreview: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  obstacleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  obstacleText: {
    fontSize: 13,
    opacity: 0.9,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#333',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});