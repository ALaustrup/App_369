const scenes = {
  start: {
    text: "?",
    getChoices: () => {
      // Possible directions to blend game mechanics with coding
      const directions = [
        "Initialize the Source",
        "Navigate to the Void",
        "Decrypt the Echo",
        "Execute the Protocol",
        "Patch the Reality",
        "Audit the Silence"
      ];
      
      // Randomly pick 3 to 6 directions
      const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const shuffled = directions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      return selected.map((label, index) => ({
        id: `choice_${index}`,
        label: label,
        nextScene: 'placeholder'
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
