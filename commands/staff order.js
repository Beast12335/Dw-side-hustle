const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const orders = require('../db/staffOrders.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff-order')
    .setDescription('Record an order by staff.')
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
        return interaction.followUp('You do not have the necessary permissions to use this command.');
      }
      
      const selectedUser = interaction.options.getUser('user');

      // Get the current month and year
      const currentDate = new Date();
      const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      // Store the user ID and current month-year into the MySQL table
      await orders.create({
            id: selectedUser.id,
            date: currentMonthYear,
          });
      await interaction.followUp(`Order for ${selectedUser.username} (${selectedUser.id}) have been added for ${currentMonthYear}.`);
    } catch (error) {
      console.error(error);
      await interaction.followUp('Error processing the command.');
    }
  },
};
