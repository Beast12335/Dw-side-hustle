const transcript = require('../events/transcript.js');
const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'confirm_close') return;
    await interaction.deferReply();
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You do not have permission to confirm closing this ticket.', ephemeral: true });
      }

      // Remove the initial user who created the channel by reacting to the select menu
      const selectMenu = interaction.message.components.find((component) => component.type === 'SELECT_MENU');
      if (selectMenu) {
        const initialUserId = selectMenu.options[0].value;
        await interaction.channel.permissionOverwrites.get(initialUserId)?.delete();
      }

      // Generate and send the transcript
      const t = await transcript(interaction.channel);

      // Send a confirmation message for closing the ticket
      await interaction.channel.send('The ticket has been closed.');
      const transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript
      const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
      if (transcriptChannel) {
        await transcriptChannel.send({files:[t]});
      }

    } catch (error) {
      console.error('Error handling confirm close button interaction:', error);
      await interaction.followUp(error);
    }
  },
};
