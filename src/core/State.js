class State {
  constructor() {
    this.player = {
      alias: "INIT_DEVELOPER",
      level: 1,
      layer: 0,
      xp: 0,
      gnosis: 0,
      stats: {
        logic: 10,
        perception: 10,
        willpower: 10
      },
      inventory: [],
      nfts: [],
      walletAddress: null,
      achievements: [],
      currentScene: 'start',
      history: []
    };
    this.gameVars = {
      progressionLevel: 0 
    };
  }

  addXP(amount) {
    if (this.player.level >= 40) return false;
    
    this.player.xp += amount;
    const xpNeeded = this.player.level * 150 + (Math.pow(this.player.level, 2) * 50);
    
    if (this.player.xp >= xpNeeded) {
      this.player.level += 1;
      this.player.xp = 0;
      return true; // Leveled up
    }
    return false;
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
    this.player.layer += 1; // Increment layer on transition
  }

  setVar(key, value) {
    this.gameVars[key] = value;
  }

  getVar(key) {
    return this.gameVars[key];
  }
}

module.exports = new State();
