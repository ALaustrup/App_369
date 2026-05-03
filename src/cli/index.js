const chalk = require('chalk');
const clear = require('clear');
const readline = require('readline-sync');
const engine = require('../core/SceneEngine');
const state = require('../core/State');
const boot = require('./BootManager');

async function run() {
  await boot();
  while (true) {
    clear();
    const scene = await engine.getCurrentScene();
    
    // Display Verification Badge
    console.log(chalk.black.bgWhite.bold(` ${scene.badge} `));
    if (state.player.githubUsername) {
      console.log(chalk.green(`SYNCED: @${state.player.githubUsername}`));
    }
    
    // Display Question
    console.log('\n' + chalk.cyan.bold(scene.text) + '\n');
    
    // Display Choices
    scene.choices.forEach((choice, index) => {
      console.log(`${chalk.yellow(index + 1)}. ${choice.label}`);
    });
    
    // Last option: Type your own
    const customIndex = scene.choices.length + 1;
    console.log(`${chalk.yellow(customIndex)}. ${chalk.italic('Type your own...')}\n`);
    
    const input = readline.question(chalk.green('Select a choice or type your command: '));
    
    // Check if input is a number matching a choice
    const choiceIndex = parseInt(input) - 1;
    
    if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < scene.choices.length) {
      // Numerical selection
      await engine.handleChoice(scene.choices[choiceIndex]);
    } else if (parseInt(input) === customIndex) {
      // Selected "Type your own"
      const customAction = readline.question(chalk.magenta('What do you imagine? '));
      await engine.handleCustomInput(customAction);
    } else if (input.trim() !== '') {
      // Direct custom input (typing instead of selecting a number)
      await engine.handleCustomInput(input);
    } else {
      // Empty input - just re-render
      continue;
    }
  }
}

run();
