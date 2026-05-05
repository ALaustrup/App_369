const state = require('../State');

class GitHubService {
  constructor() {
    this.octokit = null;
    this.git = null;
    this.Octokit = null;
    this.isNodeRuntime = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
    this.repoOwner = "ALaustrup";
    this.repoName = "App_369";
  }

  loadOctokit() {
    if (this.Octokit) return this.Octokit;
    try {
      // Lazy import prevents React Native startup from pulling unsupported modules.
      this.Octokit = require('octokit').Octokit;
      return this.Octokit;
    } catch (error) {
      console.warn('GitHubService: Octokit unavailable in this runtime');
      return null;
    }
  }

  loadGitClient() {
    if (!this.isNodeRuntime) return null;
    if (this.git) return this.git;
    try {
      this.git = require('simple-git')();
      return this.git;
    } catch (error) {
      console.warn('GitHubService: simple-git unavailable in this runtime');
      return null;
    }
  }

  async authenticate(token) {
    if (!token || token === 'dummy-token') {
      console.warn('GitHubService: Valid token not provided; running in offline mode');
      return false;
    }

    const Octokit = this.loadOctokit();
    if (!Octokit) return false;

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
    const git = this.loadGitClient();
    if (!git) {
      console.warn('GitHubService: commitProgress not supported in this environment');
      return false;
    }

    try {
      await git.add('.');
      await git.commit(message);
      await git.push('origin', 'main');
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
