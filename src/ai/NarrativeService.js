const { GoogleGenerativeAI } = require('@google/generative-ai');
const state = require('../core/State');

// Initialize with your API key environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'DUMMY_KEY');

class NarrativeService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateNextScene(userAction, currentSceneText) {
    const aiName = state.getVar('aiName') || "Your Guide";
    const currentLevel = state.player.level;
    const quarter = currentLevel <= 10 ? "Discovery" : currentLevel <= 20 ? "Resistance" : currentLevel <= 30 ? "Infiltration" : "Escape/Awakening";

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
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const json = JSON.parse(response.text());
    
    state.addXP(json.xpReward);
    state.player.gnosis += (json.gnosisGain || 0);
    return json;
  }
}

module.exports = new NarrativeService();
