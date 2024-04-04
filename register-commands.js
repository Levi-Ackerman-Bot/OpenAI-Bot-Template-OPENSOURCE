const { REST, Routes, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const commands = [
  {
    name: 'hello_world',
    description: 'Yes the bot is one',
  },
  {
    name: 'Ping!',
    description: 'Pong',
  },
];
const clientid = 1203525155649884180;
const guildid = 1164620142752309468;

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

(async () => {
  try {
    console.log('Registering slash commands....');
    
    await rest.put(
      Routes.applicationGuildCommands(clientid, guildid),
      { body: commands }
    );
    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();