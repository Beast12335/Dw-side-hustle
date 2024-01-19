const transcript = require('discord-html-transcripts');

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
      const t = await transcript.createTranscript(interaction.channel,{
        filename: `${interaction.channel.name}.html`,
        saveImages:true,
        poweredBy:false
      });

      // Send a confirmation message for deleting the ticket
      let transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript
      let transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
      if (transcriptChannel) {
        await transcriptChannel.send({files:[t]});
      }
      // Delete the ticket channel
      await interaction.channel.delete();

      

    } catch (error) {
      console.error('Error handling confirm delete button interaction:', error);
      if(error.code == 40005){
          let x = await transcript.createTranscript(interaction.channel,{
        filename: `${interaction.channel.name}.html`,
        saveImages:false,
        poweredBy:false
      });

      // Send a confirmation message for deleting the ticket
          let transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript
          let transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
          if (transcriptChannel) {
            await transcriptChannel.send({files:[x]});
      }
          await interaction.channel.delete();
      }
    }
  },
};
