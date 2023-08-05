const { ActionRowBuilder, ButtonBuilder, MessageCollector, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'add_roles') return;

    try {
      // Your code to add roles to the channel goes here
      // You can use MessageCollector to wait for user input for 10 seconds

      // Example:
      await interaction.reply({ content: 'Please provide the role ID you want to add to the channel.', ephemeral: false });
      const collector = new MessageCollector(interaction.channel, { time: 10000 }); // Collect messages for 10 seconds
      collector.on('collect', async (message) => {
        // Add the role with the provided ID to the channel
        const roleIdToAdd = message.content;
        const roleToAdd = interaction.guild.roles.cache.get(roleIdToAdd);
        if (!roleToAdd) return; // Role not found

        await interaction.channel.permissionOverwrites.create(roleToAdd,{PermissionsBitField.Flags.ViewChannel: true });

        // Send a success message
        await interaction.channel.send(`Role with ID ${roleIdToAdd} has been added to the channel.`);
      });

      collector.on('end', () => {
        // Collection time expired, handle as needed
      });

    } catch (error) {
      console.error('Error handling add roles button interaction:', error);
    }
  },
};
