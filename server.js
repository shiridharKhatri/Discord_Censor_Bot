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

  const content = message.content.toLowerCase();
  let found = false;

  const censored = message.content.replace(/\b\w+\b/g, word => {
    if (bannedWords.includes(word.toLowerCase())) {
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
