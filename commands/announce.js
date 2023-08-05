const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement message.')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Enter the announcement message.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('embed')
        .setDescription('Choose whether to send the message as an embed or not.')
        .setRequired(false)
        .addChoices({name:'Yes', value:'yes'},
                    {name:'No', value:'no'})
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      const messageContent = interaction.options.getString('message');
      const sendAsEmbed = interaction.options.getString('embed', false);

      if (sendAsEmbed === 'yes') {
        // Send the message as an embed
        const embed = new EmbedBuilder()
          .setDescription(messageContent)
          .setColor('#0099ff');

        await interaction.followUp({ embeds: [embed] });
      } else {
        // Send the message as simple text
        await interaction.followUp(messageContent);
      }

    } catch (error) {
      console.error('Error executing /announce command:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
