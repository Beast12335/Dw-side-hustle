const transcript = require('../transcript');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'confirm_close') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to confirm closing this ticket.', ephemeral: true });
      }

      // Remove the initial user who created the channel by reacting to the select menu
      const selectMenu = interaction.message.components.find((component) => component.type === 'SELECT_MENU');
      if (selectMenu) {
        const initialUserId = selectMenu.options[0].value;
        await interaction.channel.permissionOverwrites.get(initialUserId)?.delete();
      }

      // Generate and send the transcript
      await transcript(interaction.channel);

      // Send a confirmation message for closing the ticket
      await interaction.channel.send('The ticket has been closed.');

    } catch (error) {
      console.error('Error handling confirm close button interaction:', error);
    }
  },
};
