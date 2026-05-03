const state = require('./State');
const scenes = require('./scenes');
const audio = require('./services/AudioService');
const web3 = require('./services/Web3Service');
const achievements = require('./services/AchievementService');
const github = require('./services/GitHubService');
const verification = require('./services/VerificationService');

class SceneEngine {
  async getCurrentScene() {
    const sceneId = state.player.currentScene;
    const scene = scenes[sceneId];
    
    // Auto-unlock achievements if specified in scene
    if (scene.achievement) {
      await achievements.unlock(scene.achievement);
    }

    // Perform verification if at the gateway
    if (sceneId === 'start') {
      await verification.verifyProject(github);
    }

    // Evolve music based on progression
    audio.updateProgress(state.gameVars.progressionLevel);

    return {
      text: scene.text,
      choices: scene.getChoices(),
      badge: verification.getStatusBadge()
    };
  }

  async handleChoice(choice) {
    if (choice.action === 'sync_github') {
      // In a real app, this would prompt for a token. For now, we mock success.
      await github.authenticate('dummy-token');
    }

    if (choice.action === 'apply_expansion') {
      await github.applyExpansion();
    }

    if (choice.nextScene) {
      state.updateScene(choice.nextScene);
      
      // Auto-commit progress on key milestones
      if (state.player.githubUsername) {
        await github.commitProgress(`Reached ${choice.nextScene}`);
      }

      // Increment progression on each transition
      state.gameVars.progressionLevel = Math.min(1, state.gameVars.progressionLevel + 0.1);
      
      // Potential NFT reward
      if (choice.nftReward) {
        await web3.awardNFT(choice.nftReward);
      }
    }
  }

  async handleCustomInput(input) {
    console.log(`User imagined: ${input}`);
    state.updateScene('placeholder');
    state.gameVars.progressionLevel = Math.min(1, state.gameVars.progressionLevel + 0.05);
  }
}

module.exports = new SceneEngine();
