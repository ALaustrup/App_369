const state = require('../State');
const github = require('./GitHubService');

class CorruptionManager {
  constructor() {
    this.corruptionThreshold = 15; // Trigger range 15-21
  }

  isTriggered() {
    const layer = state.player.layer;
    return layer >= this.corruptionThreshold && (Math.random() > 0.8);
  }

  getCorruptionScene() {
    return {
      text: "!!! WARNING: SYSTEM CORRUPTION DETECTED !!!\nThe Demiurge has detected your unauthorized progression. A quarantine protocol is attempting to erase your reality. Run the 'System Restore' command immediately.",
      choices: [
        { id: 'restore', label: "EXECUTE SYSTEM RESTORE", nextScene: "the_kernel", action: "perform_restore" }
      ],
      badge: "!!! SYSTEM FAILURE !!!"
    };
  }

  async performRestore() {
    console.log("Restoring reality from latest valid commit...");
    await github.commitProgress("SYSTEM RESTORE: Realignment after corruption");
  }
}

module.exports = new CorruptionManager();
