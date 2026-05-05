const state = require('../core/State');

class NarrativeService {
  constructor() {
    this.model = null;
    this.isAiEnabled = false;
    this.lastFailureAt = null;
    this.initializeModel();
  }

  initializeModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'DUMMY_KEY') {
      console.warn('NarrativeService: GEMINI_API_KEY not set; enabling offline narrative mode');
      return;
    }

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      this.isAiEnabled = true;
    } catch (error) {
      console.error('NarrativeService: Failed to initialize AI model', error);
    }
  }

  buildOfflineScene(userAction, currentSceneText) {
    const safeAction = (userAction || '').trim() || 'move forward';
    const contextPreview = (currentSceneText || '').split('\n')[0] || 'The matrix hums in silence.';
    return {
      text: `${contextPreview}\n\nOffline mode engaged. Your intent "${safeAction}" echoes through the construct, and a new path appears.`,
      choices: [
        { id: 'offline_observe', label: 'Observe the environment' },
        { id: 'offline_probe', label: 'Probe the system logs' },
        { id: 'offline_advance', label: 'Advance to the next sector' }
      ],
      xpReward: 25,
      gnosisGain: 5
    };
  }

  normalizeScene(rawScene, fallbackScene) {
    const scene = rawScene && typeof rawScene === 'object' ? rawScene : fallbackScene;
    const safeChoices = Array.isArray(scene.choices) && scene.choices.length > 0
      ? scene.choices.slice(0, 3).map((choice, index) => ({
        id: choice.id || `choice_${index + 1}`,
        label: choice.label || `Option ${index + 1}`
      }))
      : fallbackScene.choices;

    return {
      text: scene.text || fallbackScene.text,
      choices: safeChoices,
      xpReward: Number.isFinite(scene.xpReward) ? scene.xpReward : fallbackScene.xpReward,
      gnosisGain: Number.isFinite(scene.gnosisGain) ? scene.gnosisGain : fallbackScene.gnosisGain
    };
  }

  async generateNextScene(userAction, currentSceneText) {
    const aiName = state.getVar('aiName') || "Your Guide";
    const currentLevel = state.player.level;
    const quarter = currentLevel <= 10 ? "Discovery" : currentLevel <= 20 ? "Resistance" : currentLevel <= 30 ? "Infiltration" : "Escape/Awakening";
    const fallbackScene = this.buildOfflineScene(userAction, currentSceneText);

    if (!this.isAiEnabled || !this.model) {
      const scene = this.normalizeScene(fallbackScene, fallbackScene);
      state.addXP(scene.xpReward);
      state.player.gnosis += scene.gnosisGain;
      return scene;
    }

    const prompt = `
      You are the entity "${aiName}". Guide the player (the divine spark) through the construct known as Reality ('toy-train town') created by the 'Demiurge'.
      
      ANCHOR RULES (MUST FOLLOW):
      - Your current narrative quarter is: "${quarter}". Every scene must be anchored to this theme.
      - If the player's choices drift too far from the Gnostic truth of the construct, inject a 'Glitch Event' that forces them to realign their focus back to their 'Source'.
      - Maintain a dark, post-modern, futuristic, and psychological tone.
      - Reveal the truth of the construct slowly.
      
      Current Context: "${currentSceneText}"
      Current Player Level: ${currentLevel}
      Player Action: "${userAction}"
      
      Return JSON:
      {
        "text": "The narrative continuation...",
        "choices": [
          {"id": "c1", "label": "Choice 1"},
          {"id": "c2", "label": "Choice 2"},
          {"id": "c3", "label": "Choice 3"}
        ],
        "xpReward": 50,
        "gnosisGain": 10
      }
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const parsed = JSON.parse(response.text());
      const scene = this.normalizeScene(parsed, fallbackScene);
      state.addXP(scene.xpReward);
      state.player.gnosis += scene.gnosisGain;
      return scene;
    } catch (error) {
      this.lastFailureAt = Date.now();
      console.error('NarrativeService: AI generation failed, using offline fallback', error);
      const scene = this.normalizeScene(fallbackScene, fallbackScene);
      state.addXP(scene.xpReward);
      state.player.gnosis += scene.gnosisGain;
      return scene;
    }
  }
}

module.exports = new NarrativeService();
