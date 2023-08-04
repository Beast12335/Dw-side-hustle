const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vouchers')
    .setDescription('Show all vouchers.')
    .setDefaultPermission(false),

  async execute(interaction) {
    
      await interaction.deferReply()
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      // Connect to the MySQL server
      const connection = await mysql.createConnection(
        process.env.DB_URL
      );

      console.log('Connected to MySQL server.');

      // Get all vouchers from the table
      const [rows] = await connection.execute('SELECT * FROM voucher');

      // Separate vouchers into active, used, and expired categories
      const activeVouchers = rows.filter((voucher) => voucher.status === 'active');
      const usedVouchers = rows.filter((voucher) => voucher.status === 'used');
      const expiredVouchers = rows.filter((voucher) => voucher.status === 'expired');

      // Create and send embeds for each category
      const activeEmbed = createVouchersEmbed('Active Vouchers', activeVouchers);
      const usedEmbed = createVouchersEmbed('Used Vouchers', usedVouchers);
      const expiredEmbed = createVouchersEmbed('Expired Vouchers', expiredVouchers);

      await interaction.followUp({ embeds: [activeEmbed, usedEmbed, expiredEmbed] });

      // Close the MySQL connection
      await connection.end();
      console.log('MySQL connection closed.');
  },
};

function createVouchersEmbed(title, vouchers) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor('#0099ff');

  if (vouchers.length === 0) {
    embed.setDescription('No vouchers found.');
  } else {
    for (const voucher of vouchers) {
      embed.addField(`Voucher ID: ${voucher.id}`, `Status: ${voucher.status}\nCode: ${voucher.code}\nExpiry Date: ${voucher.expiry_date}`);
    }
  }

  return embed;
}
