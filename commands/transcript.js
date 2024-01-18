const { SlashCommandBuilder } = require('@discordjs/builders');
const transcript = require('discord-html-transcripts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Manual work.')
    .addStringOption(option =>
      option.setName('files')
        .setDescription('Include images in the transcript')
        .addChoices({name:'Yes',value:'yes'},{name:'No',value:'no'})
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to confirm deleting this ticket.', ephemeral: true });
      }

      // Determine whether to include images in the transcript
      const includeImages = interaction.options.getString('files') === 'yes';

      // Generate the transcript based on the option
      const t = await transcript.createTranscript(interaction.channel, {
        filename: `${interaction.channel.name}.html`,
        saveImages: includeImages,
        poweredBy: false,
      });

      // Send a confirmation message with the link to the transcript
      await interaction.followUp(`Transcript sent.`);
    } catch (error) {
      console.error('Error replying with transcript:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
