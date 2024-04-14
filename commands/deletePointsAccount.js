const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField,EmbedBuilder } = require('discord.js');
const pointsModel = require('../db/points.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-account')
    .setDescription('Delete the points account for a user.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Check if the user invoking the command is an admin
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('You do not have the necessary permissions to use this command.');

        return interaction.followUp({ embeds: [errorEmbed] });
      }

      const selectedUser = interaction.options.getUser('user');

      // Check if the user has a points account
      const existingAccount = await pointsModel.findOne({ id: selectedUser.id });

      if (!existingAccount) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('User does not have a points account.');

        return interaction.followUp({ embeds: [errorEmbed] });
      }

      // Delete the points account for the user
      await pointsModel.deleteOne({ id: selectedUser.id });

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`Points account deleted for ${selectedUser.username}.`);

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
