const { Client, SlashCommandBuilder, ActivityType, EmbedBuilder, InteractionType} = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages'],
})

client.once("ready", () => {
  console.log(`${client.user.tag} is online! W in the chat`);
  client.user.setActivity({
    name: 'Nathaniel and Haruto',
    type: ActivityType.Watching,
  });
});

const IGNORE_PREFIX = process.env.IGNORE_PREFIX;
const CHANNELS = process.env.CHANNELS;

const openai = new OpenAI({
  apiKey: process.env.ApiKey,
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(IGNORE_PREFIX)) return;
  if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;

  await message.channel.sendTyping();

  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  let conversation = [];

  conversation.push({
    role: 'system',
    content: 'Act and speak like Levi from Attack on Titan'
  })

  let prevMessages = await message.channel.messages.fetch({ limit: 10});
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return;
    if (msg.content.startsWith(IGNORE_PREFIX)) return;

    const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

    if (msg.author.id === client.user.id) {
      conversation.push({
        role: 'assistant',
        name: username,
        content: msg.content,
      });

      return;
    }

    conversation.push({
      role: 'user',
      name: username,
      content: msg.content,
    });
  })
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: conversation,
  })
    .catch((error) => console.error('OpenAI Error:\n', error));

  clearInterval(sendTypingInterval);

  if (!response) {
    message.reply("I'm having some trouble with the OpenAi API. Try again later.");
    return;
  }
  const embed = new EmbedBuilder()
    .setColor('#ff6610')
    .setAuthor({ name: 'Levi Ackerman', iconURL: 'https://i.postimg.cc/QdHWbdmp/levi.png', url: 'https://discord.gg/kbj3gCMGAb' })
    .setDescription(response.choices[0].message.content);

  message.reply({ embeds: [embed] });
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'support') {
    interaction.reply('discord.gg/kbj3gCMGAb');
  }
});

    const setup = new EmbedBuilder()
    .setColor('#ff6610')
    .setAuthor({ name: 'Levi Ackerman', iconURL: 'https://i.postimg.cc/QdHWbdmp/levi.png', url: 'https://discord.gg/kbj3gCMGAb' })
    .setDescription('Thank you for adding Levi Ackerman AI Discord Bot to your server, now please select the channel that you would like the bot to reply in. We do not recommend using a general channel')
    .setThumbnail('https://i.postimg.cc/QdHWbdmp/levi.png')
    .setTimestamp()
    .setFooter({ text: 'Made by Nathaniel and Haruto', iconURL: 'https://i.postimg.cc/QdHWbdmp/levi.png' });

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setup') {
    interaction.reply({ embeds: [setup] });
  }
});

client.login(process.env.TOKEN);