const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField,EmbedBuilder } = require('discord.js');
const pointsModel = require('../db/points.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points-remove')
    .setDescription('Remove points from a user\'s balance.')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('Amount of points to remove')
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
      const amountToRemove = interaction.options.getInteger('amount');

      // Check if the user has a points account
      const userPoints = await pointsModel.findOne({ id: selectedUser.id });

      if (!userPoints) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setDescription('User does not have a points account.');

        return interaction.followUp({ embeds: [errorEmbed] });
      }

      // Check if the user has enough points to remove
      if (userPoints.balance < amountToRemove) {
        const errorEmbed = new MessageEmbed()
          .setColor('#FF0000')
          .setDescription('User does not have enough points to remove.');

        return interaction.followUp({ embeds: [errorEmbed] });
      }

      // Update the user's balance points
      await pointsModel.updateOne({ id: selectedUser.id }, { $inc: { balance: -amountToRemove } });

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`${amountToRemove} points removed from ${selectedUser.username}'s balance.`);

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
