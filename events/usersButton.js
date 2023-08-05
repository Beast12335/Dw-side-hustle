module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'view_users') return;

    try {
      // Check if the user has the role with ID 38292739
      const roleId = '860538277710790706';
      if (!interaction.member.roles.cache.has(roleId)) {
        return await interaction.reply({ content: 'You do not have permission to manage users in this ticket.', ephemeral: true });
      }

      // Send an embed with two buttons to add or remove users
      const userOptionsEmbed = {
        color: '#00ff00',
        description: 'Choose an option to manage users:',
      };

      const addUsersButton = { customId: 'add_users', label: 'Add Users', style: 'Sucess' };
      const removeUsersButton = { customId: 'remove_users', label: 'Remove Users', style: 'Danger' };

      await interaction.reply({ embeds: [userOptionsEmbed], components: [{ type: 1, components: [addUsersButton, removeUsersButton] }] });

    } catch (error) {
      console.error('Error handling users button interaction:', error);
    }
  },
};
