class State {
  constructor() {
    this.player = {
      inventory: [],
      nfts: [], // For Web3 assets
      walletAddress: null,
      achievements: [],
      currentScene: 'start',
      history: []
    };
    this.gameVars = {
      progressionLevel: 0 // Used for evolving music
    };
  }

  addAchievement(id) {
    if (!this.player.achievements.includes(id)) {
      this.player.achievements.push(id);
      return true;
    }
    return false;
  }

  addNFT(nft) {
    this.player.nfts.push(nft);
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
