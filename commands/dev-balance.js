const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dev-balance')
    .setDescription('Check the money balance of a user.')
    .setDefaultPermission(false) // Default permission set to false to be managed with the role permissions
    .addUserOption((option) => option.setName('user').setDescription('The user to check the balance for').setRequired(true)),

  async execute(interaction) {
      await interaction.deferReply()
    // Check if the user is an admin (you may need to customize this check based on your admin role)
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getUser('user');

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);

      // Fetch the money balance for the user from the 'money' table
      const [rows] = await connection.execute('SELECT sum(balance) FROM money WHERE user = ?', [userId]);

      await connection.end();

      if (rows.length === 0) {
        return interaction.followUp({ content: 'No balance found for the user.', ephemeral: false });
      }

      const balance = rows[0].balance;
      await interaction.followUp({ content: `Money balance for the <@${userId}>: ${balance} coins`, ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while checking the balance.', ephemeral: true });
    }
  },
};
