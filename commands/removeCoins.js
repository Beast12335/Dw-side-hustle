const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require('mysql2/promise');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-coins')
    .setDescription('Remove coins from a user.')
    .setDefaultPermission(false) // Default permission set to false to be managed with the role permissions
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to add money to').setRequired(true)
    )
    .addStringOption((option) => option.setName('coins').setDescription('The amount of coins to remove').setRequired(true)),

  async execute(interaction) {
      await interaction.deferReply()
    // Check if the user is an admin (you may need to customize this check based on your admin role)
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userId = interaction.options.getUser('user');
    const amount = interaction.options.getString('coins');

    if (!amount.match(/^\d+$/)) {
      return interaction.reply({ content: 'Invalid amount. Please enter a valid number.', ephemeral: true });
    }

    try {
      const connection = await mysql.createConnection(process.env.DB_URL);

      // Insert the user and money into the 'money' table
      const [rows] = await connection.execute('insert into money (user,balance,expiry)', [userId,parseInt(amount),'0']);

      await connection.end();

      await interaction.followUp({ content: `Successfully removed ${amount} coins from the user.` });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'An error occurred while removing money.', ephemeral: true });
    }
  },
};
