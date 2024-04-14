const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField,EmbedBuilder } = require('discord.js');
const points = require('../db/points.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register for the points system.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const roleID = '914051154827153488'; // ID of the role to check
      
      // Check if the user invoking the command has the specified role
      if (!interaction.member.roles.cache.has(roleID)) {
        return interaction.followUp('You do not have the necessary role to use this command.');
      }
      
      const selectedUser = interaction.member.user
      await points.insertOne({
          id: selectedUser.id,
          balance: 0
          //made_by: interaction.user.id
        });
        
        await interaction.followUp(`Account for ${selectedUser.username} (${selectedUser.id}) has been created.`);
    } catch (error) {
      console.error(error);
      await interaction.followUp('Error processing the command.');
    }
  },
};
