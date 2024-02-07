const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const client = new Discord.Client();

const gptEndpoint = 'https://api.openai.com/v1/completions';
const dalleEndpoint = 'https://api.openai.com/v1/davinci/all-cnn/draw';

client.once('ready', () => {
	console.log('Bot is ready!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (message.content.startsWith('!guideme')) {
		const prompt = message.content.slice(9);
		try {
			const response = await axios.post(gptEndpoint, {
				prompt: prompt,
				max_tokens: 50,
				model: 'text-davinci-002',
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.apiKey}`,
				},
			});
			const answer = response.data.choices[0].text.trim();
			message.channel.send(answer);
		}
		catch (error) {
			console.error('Error:', error.response.data);
			message.channel.send('An error occurred while processing your request.');
		}
	}
	if (message.content.startsWith('!chaosspell')) {
		const description = message.content.slice(12).trim();
		try {
			const response = await axios.post(dalleEndpoint, {
				prompts: [description],
				max_tokens: 0,
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${config.apiKey}`,
				},
			});
			const imageUrl = response.data.choices[0].finish_objects[0].image;
			message.channel.send(imageUrl);
		}
		catch (error) {
			console.error('Error:', error.response.data);
			message.channel.send('An error occurred while processing your request.');
		}
	}
});

client.login(config.token);