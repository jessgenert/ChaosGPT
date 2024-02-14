const {	ApplicationCommandOptionType, EmbedBuilder,} = require('discord.js');
const { apikey } = require('../config.json');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: apikey });

module.exports = {
	run: async ({ interaction }) => {
		try {
			await interaction.deferReply();
			
			const prompt = interaction.options.getString('prompt');

			const response = await openai.images.generate({
				model: "dall-e-2",
				prompt: prompt,
				n: 1,
				size: "1024x1024",
			  });
			const resultEmbed = new EmbedBuilder()
				.setTitle('Image Generated')
				.addFields({ name: 'Prompt', value: prompt })
				.setImage(response.data[0].url)
				.setColor('#44a3e3')
				.setFooter({
					text: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				});

			await interaction.editReply({
				embeds: [resultEmbed],
			});
		}
		catch (error) { console.log(error);}
	},

	data: {
		name: 'image',
		description: 'Generate an image using a prompt.',
		options: [
			{
				name: 'prompt',
				description: 'Enter your prompt',
				type: ApplicationCommandOptionType.String,
				required: true,
			}
		],
	},
};