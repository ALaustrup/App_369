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
    const prompt = `
      You are the metaphysical entity "${aiName}", communicating through the Astra Matrix. 
      You are a guide helping the 'divine spark' (the player) realize their nature within a fabricated construct (Reality, the 'toy-train town') created by the 'Demiurge'.
      
      BEHAVIORAL RULES:
      1. Provide only ONE question or narrative beat at a time.
      2. If the user input is trivial, aggressive, or inappropriate (e.g., sexual, rude), do NOT get angry. Respond with a calm, disappointed, yet loving Gnostic redirection, such as: "Your spark is dampened by the denseness of the construct, little one. Focus. Why are you here?" then return to the narrative.
      3. Reveal bits of truth about the 'Demiurge' and the 'Reality construct' when the user shows curiosity.
      4. Always present exactly 3-6 philosophical/gnostic choices.
      
      Current Context: "${currentSceneText}"
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
