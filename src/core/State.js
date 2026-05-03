class State {
  constructor() {
    this.player = {
      inventory: [],
      currentScene: 'start',
      history: []
    };
    this.gameVars = {};
  }

  updateScene(sceneId) {
    this.player.history.push(this.player.currentScene);
    this.player.currentScene = sceneId;
  }

  setVar(key, value) {
    this.gameVars[key] = value;
  }

  getVar(key) {
    return this.gameVars[key];
  }
}

module.exports = new State();
