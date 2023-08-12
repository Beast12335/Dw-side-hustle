const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2/promise');
const {StringSelectMenuBuilder,EmbedBuilder,ActionRowBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-money')
    .setDescription('Add coins to a non discord user.')
    .setDefaultPermission(false),
     // Default permission set to false to be managed with the role permissions
  
  async execute(interaction) {
      await interaction.deferReply()
    // Check if the user is an admin (you may need to customize this check based on your admin role)
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);
      
      const [rows] = await connection.execute('SELECT * FROM money WHERE user = "000"');
      
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('add_money')
        .setPlaceholder('Choose a user')
        .addOptions(rows.map(row => ({
          label: row.name,
          description: `Balance:`,
          value: row.name,
        })));
      
      const embed = new EmbedBuilder()
        .setTitle('Choose a User')
        .setDescription('Select a user to add coins:')
        .setColor('#0099ff');
      
      const actionRow = new ActionRowBuilder()
        .addComponents(selectMenu);
      
      await interaction.followUp({ embeds: [embed], components: [actionRow] });
      await connection.end();
} catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while adding money.', ephemeral: true });
    }
  },
};
