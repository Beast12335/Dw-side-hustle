const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const vouchers = require('../db/vouchers.js');
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
    await interaction.deferReply();
    try {
      const voucherCode = interaction.options.getString('code');

      // Check if the voucher code exists and is active
      const search = await vouchers.findOne({ code: voucherCode, valid: 'active' });

      if (!search) {
        // Voucher not found or not active
        return await interaction.followUp({ content: 'Invalid voucher code or the voucher has already been used/expired.', ephemeral: true });
      }

      // Mark the voucher as used
      await vouchers.updateOne({ code: voucherCode }, { $set: { valid: 'used' } });

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
