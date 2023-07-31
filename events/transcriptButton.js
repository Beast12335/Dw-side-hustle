const transcript = require('../transcript');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'transcript_button') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to generate the transcript.', ephemeral: true });
      }

      // Execute the transcript function for the ticket channel
      await transcript(interaction.channel);

    } catch (error) {
      console.error('Error handling transcript button interaction:', error);
    }
  },
};
