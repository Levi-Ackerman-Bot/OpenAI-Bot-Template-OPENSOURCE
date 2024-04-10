const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'support',
    description: 'Shows the support server!',
  },
  {
    name: 'setup',
    description: 'Start the setup process for your server!'
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands were registered successfully');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();