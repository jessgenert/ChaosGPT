const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { CommandHandler } = require('djs-commander');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

new CommandHandler({
	client,
	commandsPath: path.join(__dirname, 'commands'),
});

client.login(token);