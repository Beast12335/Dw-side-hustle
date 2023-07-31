module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'role_button') return;

    try {
      // Check if the user has the role with ID 38292739
      const roleId = '38292739';
      if (!interaction.member.roles.cache.has(roleId)) {
        return await interaction.reply({ content: 'You do not have permission to manage roles in this ticket.', ephemeral: true });
      }

      // Send an embed with two buttons to add or remove roles
      const roleOptionsEmbed = {
        color: '#00ff00',
        description: 'Choose an option to manage roles:',
      };

      const addRolesButton = { customId: 'add_roles', label: 'Add Roles', style: 'PRIMARY' };
      const removeRolesButton = { customId: 'remove_roles', label: 'Remove Roles', style: 'DANGER' };

      await interaction.reply({ embeds: [roleOptionsEmbed], components: [{ type: 'ACTION_ROW', components: [addRolesButton, removeRolesButton] }] });

    } catch (error) {
      console.error('Error handling role button interaction:', error);
    }
  },
};