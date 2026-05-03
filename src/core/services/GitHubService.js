const { Octokit } = require('octokit');
const simpleGit = require('simple-git');
const state = require('../State');

class GitHubService {
  constructor() {
    this.octokit = null;
    this.git = simpleGit();
    this.repoOwner = "ALaustrup";
    this.repoName = "App_369";
  }

  async authenticate(token) {
    try {
      this.octokit = new Octokit({ auth: token });
      const { data: user } = await this.octokit.rest.users.getAuthenticated();
      state.player.githubUsername = user.login;
      console.log(`GitHubService: Authenticated as ${user.login}`);
      return true;
    } catch (error) {
      console.error('GitHubService: Authentication failed', error);
      return false;
    }
  }

  async getCurrentRepoInfo() {
    if (!this.octokit) return null;
    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: this.repoOwner,
        repo: this.repoName
      });
      return repo;
    } catch (error) {
      return null;
    }
  }

  async commitProgress(message) {
    try {
      await this.git.add('.');
      await this.git.commit(message);
      await this.git.push('origin', 'main');
      console.log(`GitHubService: Progress committed - "${message}"`);
      return true;
    } catch (error) {
      console.error('GitHubService: Commit failed', error);
      return false;
    }
  }

  async checkForExpansions() {
    if (!this.octokit) return false;
    // In a real scenario, compare current commit with official template's latest release
    console.log('GitHubService: Checking Astra Matrix Source for Expansions...');
    return true; // Mock update available
  }

  async applyExpansion() {
    try {
      console.log('GitHubService: Synchronizing with Astra Matrix Source...');
      // Real implementation: git pull upstream main
      return true;
    } catch (error) {
      console.error('GitHubService: Expansion failed', error);
      return false;
    }
  }
}

module.exports = new GitHubService();
