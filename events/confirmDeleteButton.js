const transcript = require('discord-html-transcripts');
const { PermissionsBitField } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'confirm_delete') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.reply({ content: 'You do not have permission to confirm deleting this ticket.', ephemeral: true });
      }

      const transcriptOptions = {
        filename: `${interaction.channel.name}.html`,
        saveImages: true,
        poweredBy: false,
      };

      // Generate and send the transcript
      const t = await transcript.createTranscript(interaction.channel, transcriptOptions);
      const transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript

      // Send the transcript to the designated channel
      const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
      if (transcriptChannel) {
        await transcriptChannel.send({ files: [t] });
      }

      // Delete the ticket channel
      await interaction.channel.delete();
    } catch (error) {
      console.error('Error handling confirm delete button interaction:', error);
      await interaction.reply(error);

      // Handle error code 40005 (Unknown Interaction)
      if (error.code === 40005) {
        // Generate a transcript without saving images
        const x = await transcript.createTranscript(interaction.channel, {
          filename: `${interaction.channel.name}.html`,
          saveImages: false,
          poweredBy: false,
        });

        const transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript

        // Send the transcript to the designated channel
        const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
        if (transcriptChannel) {
          await transcriptChannel.send({ files: [x] });
        }

        // Delete the ticket channel
        await interaction.channel.delete();
      }
    }
  },
};
