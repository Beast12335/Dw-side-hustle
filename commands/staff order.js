const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const mysql = require('mysql2/promise');
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
      
      const connection = await mysql.createConnection(process.env.DB_URL);
      // Retrieve the selected user ID
      const selectedUser = interaction.options.getUser('user');

      // Get the current month and year
      const currentDate = new Date();
      const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      // Store the user ID and current month-year into the MySQL table
      const [rows] = await connection.execute(`INSERT INTO staff VALUES ('${selectedUser.id}', '${currentMonthYear}')`);
      await connection.end();
      await interaction.followUp(`Order for ${selectedUser.username} (${selectedUser.id}) have been added for ${currentMonthYear}.`);
    } catch (error) {
      console.error(error);
      await interaction.followUp('Error processing the command.');
    }
  },
};
