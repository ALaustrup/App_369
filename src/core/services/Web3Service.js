const state = require('../State');

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.ethers = null;
  }

  loadEthers() {
    if (this.ethers) return this.ethers;
    try {
      this.ethers = require('ethers');
      return this.ethers;
    } catch (error) {
      console.warn('Web3Service: ethers unavailable in this runtime');
      return null;
    }
  }

  async connectWallet(privateKey = null) {
    try {
      if (privateKey) {
        const ethersLib = this.loadEthers();
        if (!ethersLib) return null;
        // CLI / Manual private key connection
        const wallet = new ethersLib.Wallet(privateKey);
        state.player.walletAddress = wallet.address;
        this.signer = wallet;
        return wallet.address;
      }
      
      // GUI / Web environment would use WalletConnect or injected provider
      // For now, we scaffold the connection logic
      console.log('Web3Service: Waiting for wallet connection...');
      return null;
    } catch (error) {
      console.error('Web3Service: Connection failed', error);
      return null;
    }
  }

  async awardNFT(metadata) {
    // Logic to "mint" or record an NFT reward
    console.log(`Web3Service: Awarding NFT - ${metadata.name}`);
    state.addNFT({
      ...metadata,
      timestamp: Date.now(),
      minted: false // Pending blockchain confirmation
    });
  }

  async getInventory() {
    return state.player.nfts;
  }
}

module.exports = new Web3Service();
