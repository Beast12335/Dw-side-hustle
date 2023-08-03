const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('completed')
    .setDescription('Move the channel to the specified category.')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Enter the category to move the channel to.')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.reply({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      const category = interaction.options.getString('category');

      // Get the channel from which the command is used
      const channel = interaction.channel;
      
      // Find the category in the guild by name
      const categoryObj = interaction.guild.channels.cache.find(ch => ch.type === 'GUILD_CATEGORY' && ch.name === category);
      
      if (!categoryObj) {
        return await interaction.reply({ content: `Category "${category}" not found.`, ephemeral: true });
      }

      // Move the channel to the specified category
      await channel.setParent(categoryObj.id);

      await interaction.reply({ content: `Channel moved to the category "${category}" successfully.`, ephemeral: true });

    } catch (error) {
      console.error('Error executing /completed command:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
