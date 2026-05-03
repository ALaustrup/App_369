const { GoogleGenerativeAI } = require('@google/generative-ai');
const state = require('../State');

// Initialize with your API key environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'DUMMY_KEY');

class NarrativeService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateNextScene(userAction, currentSceneText) {
    const prompt = `
      You are the Dungeon Master for a post-modern, futuristic, dark, and psychological RPG game with a Gnostic-inspired world. 
      The player is a developer navigating the "Astra Matrix".
      Current Context: "${currentSceneText}"
      Player Action: "${userAction}"
      
      Generate the next scene in JSON format:
      {
        "text": "The psychological narrative continuation...",
        "choices": [
          {"id": "c1", "label": "Narrative choice 1"},
          {"id": "c2", "label": "Narrative choice 2"},
          {"id": "c3", "label": "Narrative choice 3"}
        ],
        "xpReward": 50,
        "nftReward": {"name": "GENERATED_ASSET", "type": "Collectible"}
      }
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const json = JSON.parse(response.text());
    
    // Update State
    state.addXP(json.xpReward);
    return json;
  }
}

module.exports = new NarrativeService();
