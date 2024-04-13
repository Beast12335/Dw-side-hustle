const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const orders = require('../db/staffOrders.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('orders')
    .setDescription('Shows the total entries per month for a user.')
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
      // Retrieve the selected user ID
      const selectedUser = interaction.options.getUser('user');

      // Fetch all entries for the respective user
      const cursor = await orders.find({ id: selectedUser.id });
      const rows = await cursor.toArray();

      if (rows.length === 0) {
        return interaction.followUp('No entries found for the selected user.');
      }

      // Process the raw data to calculate entries per month
      const entriesPerMonth = {};
      rows.forEach(entry => {
        const monthYear = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        entriesPerMonth[monthYear] = (entriesPerMonth[monthYear] || 0) + 1;
      });

      // Create an embed to display the results
      const embed = new EmbedBuilder()
        .setTitle(`Total entries for ${selectedUser.username} (${selectedUser.id})`)
        .setColor(0x00ff00);

      // Format the results for display
      Object.entries(entriesPerMonth).forEach(([monthYear, entryCount]) => {
        const entryText = `${entryCount} orders in ${monthYear}`;
        if (embed.length + entryText.length < 2048) {
          embed.addFields({ name: monthYear, value: `${entryCount} orders`, inline: true });
        } else {
          // Send the current embed and start a new one
          interaction.followUp({ embeds: [embed] });
          embed.spliceFields(0, embed.fields.length); // Clear existing fields
          embed.addFields({ name: monthYear, value: `${entryCount} orders`, inline: true });
        }
      });
      // Send the final embed
      await interaction.followUp({ embeds: [embed] });

      // Close the database connection
      await connection.end();
    } catch (error) {
      console.error(error);
      await interaction.followUp('Error processing the command.');
    }
  },
};
