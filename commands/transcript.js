const { SlashCommandBuilder } = require('@discordjs/builders');
const transcript = require ('discord-html-transcripts')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('manual work.'),

  async execute(interaction) {
    await interaction.deferReply()
    try {
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
      const transcriptChannelId = '914051184820633620'; // Replace with the desired channel ID to send the transcript
      const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);
      if (transcriptChannel) {
        await transcriptChannel.send({files:[t]});
      }
      //await interaction.deferReply()
      await interaction.followUp(`transcript sent.`);
    } catch (error) {
      console.error('Error replying with pong:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
