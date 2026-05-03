const state = require('../State');

class VerificationService {
  constructor() {
    this.isVerified = false;
    this.orgName = "ALaustrup"; // Currently set to your username, can be changed to Astra-Matrix
  }

  async verifyProject(githubService) {
    try {
      // 1. Check for the local manifest
      // (In a real scenario, this would be a signed hash)
      
      // 2. Check GitHub API for parent/template status
      const repoInfo = await githubService.getCurrentRepoInfo();
      
      if (repoInfo && repoInfo.is_template) {
         this.isVerified = true;
      }

      // Check if forked from or based on the template repo we created earlier
      if (repoInfo && (repoInfo.name === 'App_369' || repoInfo.template_repository)) {
        this.isVerified = true;
      }

      state.setVar('isVerifiedOriginal', this.isVerified);
      return this.isVerified;
    } catch (error) {
      console.error('VerificationService: Verification failed', error);
      return false;
    }
  }

  getStatusBadge() {
    return this.isVerified ? "★ ASTRA MATRIX ORIGINAL" : "UNVERIFIED MODULE";
  }
}

module.exports = new VerificationService();
