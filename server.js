require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const bannedWords = JSON.parse(fs.readFileSync('./badwords.json', 'utf-8'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  let found = false;

  const censored = message.content.replace(/\b\w+\b/g, word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();  // Remove non-alphanumeric characters
    const wordWithoutSpaces = cleanWord.replace(/\s+/g, '');  // Remove spaces inside the word

    if (bannedWords.some(badWord => badWord.toLowerCase().replace(/\s+/g, '') === wordWithoutSpaces)) {
      found = true;
      return '█'.repeat(word.length);
    }
    return word;
  });

  if (found) {
    message.delete().catch(console.error); 
    message.channel.send({
      content: `⚠️ ${message.author}, your message contained rough words and was deleted. Here's the censored version:\n${censored}`
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
