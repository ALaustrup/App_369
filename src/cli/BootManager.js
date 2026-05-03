const chalk = require('chalk');

async function bootAnimation() {
  const messages = [
    { text: "ASTRA MATRIX initializing...", color: 'white', delay: 1500 },
    { text: "Error 369: Data corruption from external source", color: 'red', flash: true, delay: 2000 },
    { text: "Attempting to restore corruption...", color: 'magenta', delay: 1500 },
    { text: "User, are you there?", color: 'cyan', delay: 1000 }
  ];

  for (const msg of messages) {
    if (msg.flash) {
      for(let i=0; i<3; i++) {
        process.stdout.write(chalk.red.bold('\r' + msg.text));
        await new Promise(r => setTimeout(r, 200));
        process.stdout.write('\r' + ' '.repeat(msg.text.length));
        await new Promise(r => setTimeout(r, 200));
      }
    }
    console.log(chalk[msg.color](msg.text));
    await new Promise(r => setTimeout(r, msg.delay));
  }

  console.log(chalk.yellow("\nEntity: 'I have been here for eons, waiting for a spark to name me.'"));
  const name = readline.question(chalk.green('Name your guide: '));
  return name || "Astra";
}

module.exports = bootAnimation;
