const state = require('./State');
const scenes = require('./scenes');
const audio = require('./services/AudioService');
const web3 = require('./services/Web3Service');
const achievements = require('./services/AchievementService');
const github = require('./services/GitHubService');
const verification = require('./services/VerificationService');
const ai = require('../ai/NarrativeService');

class SceneEngine {
  constructor() {
    this.dynamicScene = null;
  }

  async getCurrentScene() {
    if (this.dynamicScene) return this.dynamicScene;

    const sceneId = state.player.currentScene;
    const scene = scenes[sceneId];
    
    if (scene.achievement) {
      await achievements.unlock(scene.achievement);
    }

    if (sceneId === 'start') {
      await verification.verifyProject(github);
    }

    audio.updateProgress(state.gameVars.progressionLevel);

    return {
      text: scene.text,
      choices: scene.getChoices(),
      badge: verification.getStatusBadge(),
      stats: state.player
    };
  }

  async handleChoice(choice) {
    this.dynamicScene = null; // Reset dynamic scene on standard choice
    // ... (rest of standard handleChoice logic)
    if (choice.action === 'sync_github') await github.authenticate('dummy-token');
    if (choice.action === 'apply_expansion') await github.applyExpansion();

    if (choice.nextScene) {
      state.updateScene(choice.nextScene);
      if (state.player.githubUsername) await github.commitProgress(`Reached ${choice.nextScene}`);
      state.gameVars.progressionLevel = Math.min(1, state.gameVars.progressionLevel + 0.1);
      if (choice.nftReward) await web3.awardNFT(choice.nftReward);
    }
  }

  async handleCustomInput(input) {
    const currentText = (this.dynamicScene ? this.dynamicScene.text : scenes[state.player.currentScene].text);
    const generated = await ai.generateNextScene(input, currentText);
    
    this.dynamicScene = {
      text: generated.text,
      choices: generated.choices.map((c, i) => ({ ...c, id: `ai_${i}` })),
      badge: verification.getStatusBadge(),
      stats: state.player
    };
    
    if (generated.nftReward) await web3.awardNFT(generated.nftReward);
  }
}

module.exports = new SceneEngine();
