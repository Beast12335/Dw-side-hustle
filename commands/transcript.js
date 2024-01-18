const { SlashCommandBuilder } = require('@discordjs/builders');
const transcript = require('discord-html-transcripts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Manual work.'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to confirm deleting this ticket.', ephemeral: true });
      }

      // Generate and save the transcript
      const t = await transcript.createTranscript(interaction.channel, {
        filename: `${interaction.channel.name}.html`,
        saveImages: true,
        poweredBy: false,
      });

      // Split the transcript into chunks (adjust the chunk size as needed)
      const chunkSize = 200; // Discord message size limit
      const chunks = splitIntoChunks(t, chunkSize);

      // Send each chunk as a separate message
      for (const chunk of chunks) {
        await interaction.followUp({ files: [chunk] });
      }
      
    } catch (error) {
      console.error('Error replying with transcript:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};

function splitIntoChunks(text, chunkSize) {
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return text.match(regex);
}
