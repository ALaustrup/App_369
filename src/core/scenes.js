const scenes = {
  start: {
    text: "?",
    achievement: "WELCOME_TO_THE_VOID",
    getChoices: () => {
      // Possible directions to blend game mechanics with coding
      const directions = [
        { label: "Initialize the Source", nft: "SOURCE_FRAG" },
        { label: "Navigate to the Void", nft: "VOID_PASS" },
        { label: "Decrypt the Echo", nft: "ECHO_KEY" },
        { label: "Execute the Protocol", nft: "PROTOCOL_X" },
        { label: "Patch the Reality", nft: "REALITY_PATCH" },
        { label: "Audit the Silence", nft: "SILENCE_LOG" }
      ];
      
      // Randomly pick 3 to 6 directions
      const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const shuffled = directions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      return selected.map((item, index) => ({
        id: `choice_${index}`,
        label: item.label,
        nextScene: 'placeholder',
        nftReward: { name: item.nft, type: 'Collectible' }
      }));
    }
  },
  placeholder: {
    text: "The path unfolds before you, but the logic is still compiling...",
    getChoices: () => [
      { id: 'restart', label: 'Return to the Origin', nextScene: 'start' }
    ]
  }
};

module.exports = scenes;
