const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuiler } = require('discord.js');
const pointsModel = require('../db/points.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance-points')
    .setDescription('Check your balance points.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const userID = interaction.user.id;

      // Check if the user exists in the database
      const userPoints = await pointsModel.findOne({ id: userID });

      if (!userPoints) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('You do not have any balance points.');

        return interaction.followUp({ embeds: [errorEmbed] });
      }

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`Your balance points: ${userPoints.balance}`);

      await interaction.followUp({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Error processing the command.');

      await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
