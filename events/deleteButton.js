const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'delete_button') return;

    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return await interaction.reply({ content: 'You do not have permission to delete this ticket.', ephemeral: true });
      }

      // Send a confirmation message with a red button to confirm the ticket deletion
      const confirmEmbed = {
        color: 'RED',
        description: 'Confirm you wish to delete the ticket.',
      };

      const confirmButton = { customId: 'confirm_delete', label: 'Confirm', style: 'ButtonStyle.Danger' };

      await interaction.reply({ embeds: [confirmEmbed], components: [{ type: 'ACTION_ROW', components: [confirmButton] }] });

    } catch (error) {
      console.error('Error handling delete button interaction:', error);
    }
  },
};
