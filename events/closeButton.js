const { ActionRowBuilder, PermissionsBitField, ButtonBuilder,ButtonStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'close_ticket') return;
    await interaction.deferReply();
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You do not have permission to close this ticket.', ephemeral: true });
      }

      // Send a confirmation message with a red button to confirm the ticket closing
      const confirmEmbed = {
        color: 0xff0000,
        description: 'Confirm you wish to close the ticket.',
      };

      const confirmButton = {type:2, custom_id: 'confirm_close', label: 'Confirm', style: 4 };

      await interaction.followUp({ embeds: [confirmEmbed], components: [{ type: 1, components: [confirmButton] }] });

    } catch (error) {
      console.error('Error handling close button interaction:', error);
      await interaction.followUp(error);
    }
  },
};
