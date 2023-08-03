const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsetup')
    .setDescription('Setup ticket system.')
    .setDefaultPermission(false)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Enter the channel to send the embed.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Enter the description for the embed.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('types')
        .setDescription('Enter the ticket types separated by commas.')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.reply({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      const types = interaction.options.getString('types').split(',');

      // Create the embed for ticket setup
      const embed = new MessageEmbed()
        .setTitle('Ticket Setup')
        .setDescription(message)
        .setColor('#0099ff');

      // Create a select menu with options from the types array
      const selectMenu = new MessageSelectMenu()
        .setCustomId('ticket_type')
        .setPlaceholder('Select a ticket type');

      for (const type of types) {
        selectMenu.addOptions({
          label: type.trim(),
          value: type.trim(),
        });
      }

      // Create an action row to hold the select menu
      const actionRow = new MessageActionRow()
        .addComponents(selectMenu);

      // Send the embed with the select menu to the specified channel
      await channel.send({ embeds: [embed], components: [actionRow] });

      await interaction.reply({ content: 'Ticket system has been set up successfully!', ephemeral: true });

    } catch (error) {
      console.error('Error executing /ticketsetup command:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
