const {
	ApplicationCommandOptionType,
	EmbedBuilder,
} = require('discord.js');
const { replicateKey } = require('../config.json');
const models = require('../models');

module.exports = {
	run: async ({ interaction }) => {
		try {
			await interaction.deferReply();

			const { default: Replicate } = await import('replicate');

			const replicate = new Replicate({
				auth: replicateKey,
			});

			const prompt = interaction.options.getString('prompt');
			const model = interaction.options.getString('model') || models[0].value;

			const output = await replicate.run(model, { input: { prompt } });

			const resultEmbed = new EmbedBuilder()
				.setTitle('Image Generated')
				.addFields({ name: 'Prompt', value: prompt })
				.setImage(output[0])
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
			},
			{
				name: 'model',
				description: 'The image model',
				type: ApplicationCommandOptionType.String,
				choices: models,
				required: false,
			},
		],
	},
};