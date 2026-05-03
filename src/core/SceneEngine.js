const state = require('./State');
const scenes = require('./scenes');

class SceneEngine {
  getCurrentScene() {
    const sceneId = state.player.currentScene;
    const scene = scenes[sceneId];
    
    return {
      text: scene.text,
      choices: scene.getChoices()
    };
  }

  handleChoice(choice) {
    if (choice.nextScene) {
      state.updateScene(choice.nextScene);
    }
  }

  handleCustomInput(input) {
    // For now, custom input just logs and moves to placeholder
    console.log(`User imagined: ${input}`);
    state.updateScene('placeholder');
  }
}

module.exports = new SceneEngine();
