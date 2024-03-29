const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usevoucher')
    .setDescription('Use a voucher.')
    .addStringOption(option =>
      option
        .setName('code')
        .setDescription('Enter the voucher code.')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply()
    try {
     // await interaction.deferReply()
      const voucherCode = interaction.options.getString('code');

      // Connect to the MySQL server
      const connection = await mysql.createConnection(
        process.env.DB_URL
      );

      console.log('Connected to MySQL server.');

      // Check if the voucher code exists and is active
      const [rows] = await connection.execute('SELECT * FROM voucher WHERE code = ? AND valid = ?', [voucherCode, 'active']);
      if (rows.length === 0) {
        // Voucher not found or not active
        return await interaction.followUp({ content: 'Invalid voucher code or the voucher has already been used/expired.', ephemeral: true });
      }

      // Mark the voucher as used
      const voucherId = rows[0].code;
      await connection.execute('UPDATE voucher SET valid = ? WHERE code = ?', ['used', voucherId]);

      // Close the MySQL connection
      await connection.end();
      console.log('MySQL connection closed.');

      // Success message
      const successEmbed = new EmbedBuilder()
        .setTitle('Voucher Used Successfully')
        .setDescription(`The voucher with code "${voucherCode}" has been successfully marked as used.`)
        .setColor('#00ff00');

      await interaction.followUp({ embeds: [successEmbed] });

    } catch (error) {
      console.error('Error executing /usevoucher command:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
