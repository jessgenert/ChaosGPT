const { apikey } = require('../config.json');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: apikey });
const { ApplicationCommandOptionType } = require('discord.js');
module.exports = {
	run: async ({ interaction }) => {
		try {
			await interaction.deferReply();

			const prompt = interaction.options.getString('prompt');


			(async function generateCompletion() {
				try {
					const completion = await openai.chat.completions.create({
						messages: [{ role: 'system', content: prompt }],
						model: 'gpt-3.5-turbo-0125',
						max_tokens: 300,
						temperature: 1.4,
					});

					interaction.editReply(`${interaction.user} prompted: \\"${prompt}\\"\n\n${completion.choices[0].message.content}`);

				}
				catch (error) {

					console.error('Error generating completion:', error);
					throw error;
				}

			})(prompt);
		}
		catch (error) {
			console.error('Error generating completion:', error);
		}
	},

	data: {
		name: 'chat',
		description: 'Generate some information using a prompt.',
		options: [
			{
				name: 'prompt',
				description: 'Enter your prompt',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
};