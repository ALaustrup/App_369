const state = require('../State');

class AchievementService {
  constructor() {
    this.platform = this.detectPlatform();
  }

  detectPlatform() {
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // Potentially Android
      return 'android';
    }
    return 'local';
  }

  async unlock(achievementId) {
    const isNew = state.addAchievement(achievementId);
    
    if (isNew) {
      console.log(`Achievement Unlocked: ${achievementId}`);
      
      if (this.platform === 'android') {
        // Here we would call the native Google Play API
        // Example: PlayGames.unlockAchievement(achievementId);
        console.log(`AchievementService: Syncing ${achievementId} to Google Play`);
      }
    }
  }

  getUnlocked() {
    return state.player.achievements;
  }
}

module.exports = new AchievementService();
