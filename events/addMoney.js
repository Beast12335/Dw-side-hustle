const { MessageCollector } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config()

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'add_money')return;
    await interaction.deferReply();
    try {
      const connection = await mysql.createConnection(process.env.DB_URL)
      // Get the selected value from the select menu
      const selectedUser = interaction.values[0];
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            await interaction.followUp({ content: 'You do not have permission to interact with this select menu.', ephemeral: true });
            return;
          }
      await interaction.followUp({ content: `How much coins would you like to add to ${selectedUser}? Please reply within 20 seconds.`, ephemeral: false });
      
      const collector = interaction.channel.createMessageCollector({ time: 20000 });
      const expired = 3;
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + expired);

      
      collector.on('collect', async m => {
          const coinsToAdd = parseFloat(m.content);
      
          if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
            await interaction.followUp({ content: 'Invalid input. Please provide a valid positive number.', ephemeral: true });
            return;
            }
      
          const [updateResult] = await connection.execute('insert into money values(?,?,?,?)', ['000',selectedUser,coinsToAdd,expiryDate]);
      
          if (updateResult.affectedRows === 1) {
            await interaction.followUp(`Successfully added ${coinsToAdd} coins to ${selectedUser}'s balance.`);
            } else {
              await interaction.followUp('An error occurred while updating the balance.');
            }
          collector.stop()
          });
      
      collector.on('end', async collected => {
        if (collected.size === 0) {
            await interaction.followUp('Time limit exceeded. Please run the command again.');
            }
          });
      } catch (error) {
      await interaction.followUp(error);
      console.error('Error handling add money interaction:', error);
    }
  },
};
