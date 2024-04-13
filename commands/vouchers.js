const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const Voucher = require('../db/vouchers.js');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vouchers')
    .setDescription('Show all vouchers.')
    .setDefaultPermission(false),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      // Retrieve all vouchers from the database
      const vouchers = await Voucher.find();

      // Separate vouchers into active, used, and expired categories
      const categories = {
        active: [],
        used: [],
        expired: [],
      };

      vouchers.forEach((voucher) => {
        categories[voucher.valid].push(voucher);
      });

      // Create and send embeds for each category
      for (const [category, vouchers] of Object.entries(categories)) {
        const embed = createVouchersEmbed(`${category.charAt(0).toUpperCase() + category.slice(1)} Vouchers`, vouchers);
        await interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error executing /vouchers command:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};

function createVouchersEmbed(title, vouchers) {
  const embedFields = vouchers.map((voucher) => ({
    name: `Voucher ID: ${voucher.code}`,
    value: `Status: ${voucher.valid}\nExpiry Date: ${voucher.date}`,
  }));

  const embed = {
    title,
    color: 39423,
    fields: embedFields,
  };

  return embed;
}
