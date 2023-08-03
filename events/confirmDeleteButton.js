const transcript = require('../events/transcript.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'confirm_delete') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to confirm deleting this ticket.', ephemeral: true });
      }

      // Generate and send the transcript
      await transcript(interaction.channel);

      // Delete the ticket channel
      await interaction.channel.delete();

      // Send a confirmation message for deleting the ticket
      const transcriptChannelId = '393829383'; // Replace with the desired channel ID to send the transcript
      const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
      if (transcriptChannel) {
        await transcriptChannel.send('The ticket has been deleted.');
      }

    } catch (error) {
      console.error('Error handling confirm delete button interaction:', error);
    }
  },
};
