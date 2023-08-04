const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Replies with pong.'),

  async execute(interaction) {
    await interaction.deferReply()
    try {
      //await interaction.deferReply()
      await interaction.followUp('pong');
    } catch (error) {
      console.error('Error replying with pong:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
