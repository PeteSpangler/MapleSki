import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Mountain, mountainArray } from "../assets/mountains/mountainArray";
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

  const safeTextColor = "#11181C";
  const safeBorderColor =  "#687076";
  const safeTintColor = "#0a7ea4";

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
          <Text style={styles.modalTitle}>Select Mountain</Text>
          
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
                <View>
                  <Text style={styles.mountainName}>{mountain.name}</Text>
                  <Text style={styles.mountainDesc}>{mountain.desc}</Text>
                  
                  <View style={styles.obstaclePreview}>
                    <View style={styles.obstacleRow}>
                      <Text style={styles.obstacleText}>
                        Trees: {mountain.trees}
                      </Text>
                      <Text style={styles.obstacleText}>
                        Jerries: {mountain.jerries}
                      </Text>
                    </View>
                    <View style={styles.obstacleRow}>
                      <Text style={styles.obstacleText}>
                        Moguls: {mountain.moguls}
                      </Text>
                      <Text style={styles.obstacleText}>
                        Bears: {mountain.bears}
                      </Text>
                    </View>
                  </View>
                  
                  {currentMountain.index === mountain.index && (
                    <Text style={[styles.selectedText, { color: safeTintColor }]}>
                      Currently Selected
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: safeTextColor }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: "#ffffff" }]}>
              Cancel
            </Text>
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
    color: '#000000',
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
    textAlign: 'center'
  },
  mountainDesc: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    textAlign: 'center'
  },
  obstaclePreview: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  obstacleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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