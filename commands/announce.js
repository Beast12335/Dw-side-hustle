const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

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
        .addChoices({'Yes', 'yes'},
                    {'No', 'no'})
    ),

  async execute(interaction) {
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return await interaction.reply({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      const messageContent = interaction.options.getString('message');
      const sendAsEmbed = interaction.options.getString('embed', false);

      if (sendAsEmbed === 'yes') {
        // Send the message as an embed
        const embed = new MessageEmbed()
          .setDescription(messageContent)
          .setColor('#0099ff');

        await interaction.reply({ embeds: [embed] });
      } else {
        // Send the message as simple text
        await interaction.reply(messageContent);
      }

    } catch (error) {
      console.error('Error executing /announce command:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
