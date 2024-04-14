const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const pointsModel = require('../db/points.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memberlist')
    .setDescription('Display a list of members.')
    .setDefaultPermission(false),

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

      // Fetch all users from the database
      const allUsers = await pointsModel.find();

      // Separate users based on how their account was created
      const selfCreatedUsers = allUsers.filter(user => !user.made_by);
      const adminCreatedUsers = allUsers.filter(user => user.made_by);

      // Prepare embeds
      const selfCreatedEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Members who created their account themselves:')
        .setDescription(selfCreatedUsers.map(user => `<@${user.id}>`).join('\n') || 'No members found.');

      const adminCreatedEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Members whose account was created by admins:')
        .setDescription(adminCreatedUsers.map(user => `<@${user.id}>`).join('\n') || 'No members found.');

      // Send the embeds
      await interaction.followUp({ embeds: [selfCreatedEmbed] });
      await interaction.followUp({ embeds: [adminCreatedEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Error processing the command.');

      await interaction.followUp({ embeds: [errorEmbed] });
    }
  },
};
