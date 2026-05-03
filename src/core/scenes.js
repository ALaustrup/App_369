const scenes = {
  start: {
    text: "?",
    achievement: "WELCOME_TO_THE_VOID",
    getChoices: () => {
      const directions = [
        { label: "Initialize the Source", nft: "SOURCE_FRAG" },
        { label: "Navigate to the Void", nft: "VOID_PASS" },
        { label: "Decrypt the Echo", nft: "ECHO_KEY" },
        { label: "Execute the Protocol", nft: "PROTOCOL_X" }
      ];
      
      const count = Math.floor(Math.random() * 2) + 3; // 3 to 4
      const shuffled = directions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      return selected.map((item, index) => ({
        id: `start_${index}`,
        label: item.label,
        nextScene: item.label.includes("Void") ? "the_void" : "the_kernel",
        nftReward: { name: item.nft, type: 'Core Fragment' }
      }));
    }
  },
  the_kernel: {
    text: "You stand before the Kernel. It pulses with a raw, binary light—the heartbeat of all logic in this realm. Commands hum in the air around you.",
    getChoices: () => [
      { id: 'k1', label: "Query System Status", nextScene: "system_status" },
      { id: 'k2', label: "Inject Custom Routine", nextScene: "the_compiler" },
      { id: 'k3', label: "Listen to the Clock Cycles", nextScene: "ambient_evolution" },
      { id: 'k4', label: "Return to the Gateway", nextScene: "start" }
    ]
  },
  the_void: {
    text: "The silence here is absolute. It is a vast canvas of unallocated memory, stretching infinitely in every direction, waiting for your instruction.",
    achievement: "VOID_WALKER",
    getChoices: () => [
      { id: 'v1', label: "Allocate Memory Space", nextScene: "allocation" },
      { id: 'v2', label: "Search for Deleted Fragments", nextScene: "fragment_search" },
      { id: 'v3', label: "Drift into the Buffer", nextScene: "buffer_drift" },
      { id: 'v4', label: "Retreat to the Gateway", nextScene: "start" }
    ]
  },
  system_status: {
    text: "SYSTEM REPORT:\nCPU: Evolving\nMEMORY: Expanding\nREALITY: Unstable\n\nA firewall looms in the distance, flickering with crimson alerts.",
    getChoices: () => [
      { id: 'ss1', label: "Attempt Breach", nextScene: "the_firewall", nftReward: { name: "BREACH_KIT", type: "Utility" } },
      { id: 'ss2', label: "Analyze Logs", nextScene: "the_kernel" },
      { id: 'ss3', label: "Ignore the Warnings", nextScene: "the_network" }
    ]
  },
  the_firewall: {
    text: "The Firewall is a wall of searing logic gates. To pass, you must resolve the contradiction at its core.",
    achievement: "BEYOND_THE_BARRIER",
    getChoices: () => [
      { id: 'fw1', label: "Execute Decryption Loop", nextScene: "the_network" },
      { id: 'fw2', label: "Bypass via Subroutine", nextScene: "the_void" },
      { id: 'fw3', label: "Force Reboot", nextScene: "start" }
    ]
  },
  the_network: {
    text: "You have reached the Network—a shimmering web of interconnected nodes. Each node represents a different mind, a different piece of code.",
    getChoices: () => [
      { id: 'net1', label: "Establish Handshake", nextScene: "node_connection", nftReward: { name: "NODE_KEY", type: "Access" } },
      { id: 'net2', label: "Packet Sniff the Stream", nextScene: "the_kernel" },
      { id: 'net3', label: "Disconnect Safely", nextScene: "start" }
    ]
  },
  placeholder: {
    text: "The path unfolds before you, but the logic is still compiling...",
    getChoices: () => [
      { id: 'restart', label: 'Return to the Origin', nextScene: 'start' }
    ]
  }
};

// Map missing scenes to placeholder to prevent crashes during early exploration
Object.keys(scenes).forEach(key => {
  const choices = scenes[key].getChoices();
  choices.forEach(c => {
    if (!scenes[c.nextScene]) {
      scenes[c.nextScene] = {
        text: `You have arrived at ${c.nextScene.replace('_', ' ')}. The data here is still initializing...`,
        getChoices: () => [{ id: 'back', label: 'Backtrack', nextScene: key }]
      };
    }
  });
});

module.exports = scenes;
