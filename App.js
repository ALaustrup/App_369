import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
// Note: We use the shared core logic
const engine = require('./src/core/SceneEngine');

export default function App() {
  const [scene, setScene] = useState(null);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    loadScene();
  }, []);

  const loadScene = async () => {
    const nextScene = await engine.getCurrentScene();
    setScene(nextScene);
  };

  const handleChoice = async (choice) => {
    await engine.handleChoice(choice);
    await loadScene();
  };

  const handleCustomSubmit = async () => {
    if (customInput.trim() !== '') {
      await engine.handleCustomInput(customInput);
      setCustomInput('');
      await loadScene();
    }
  };

  if (!scene) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{scene.badge}</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.questionText}>{scene.text}</Text>
        </View>

        <View style={styles.choicesContainer}>
          {scene.choices.map((choice, index) => (
            <TouchableOpacity 
              key={choice.id || index} 
              style={styles.choiceButton}
              onPress={() => handleChoice(choice)}
            >
              <Text style={styles.choiceText}>{`${index + 1}. ${choice.label}`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Type your own..."
            placeholderTextColor="#666"
            value={customInput}
            onChangeText={setCustomInput}
            onSubmitEditing={handleCustomSubmit}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleCustomSubmit}>
            <Text style={styles.submitButtonText}>Execute</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  badgeContainer: {
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  questionText: {
    color: '#0ff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  choicesContainer: {
    marginBottom: 30,
  },
  choiceButton: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  choiceText: {
    color: '#ff0',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  inputSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#111',
    color: '#0f0',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    fontFamily: 'monospace',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#004400',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0f0',
  },
  submitButtonText: {
    color: '#0f0',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
