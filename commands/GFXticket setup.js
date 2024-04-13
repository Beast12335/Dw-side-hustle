const { SlashCommandBuilder,Guild } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

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
    await interaction.deferReply()
    try {
      //await interaction.deferReply()
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      const types = interaction.options.getString('types').split(',');


      // Create the embed for ticket setup
      const embed = new EmbedBuilder()
        .setTitle('Ticket Setup')
        .setDescription(message)
        .setColor('#0099ff')
        .setThumbnail('https://cdn.discordapp.com/icons/808758266792247297/3c7a14d0f10d9bd3be4921bf0e6be5ca.png')
        .setFooter({text:'Design Wonderland',iconUrl:'https://cdn.discordapp.com/icons/808758266792247297/3c7a14d0f10d9bd3be4921bf0e6be5ca.png'});

      // Create a select menu with options from the types array
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('ticket_type')
        .setPlaceholder('Select a ticket type');

      for (const type of types) {
        selectMenu.addOptions({
          label: type.trim(),
          value: type.trim(),
        });
      }

      // Create an action row to hold the select menu
      const actionRow = new ActionRowBuilder()
        .addComponents(selectMenu);

      // Send the embed with the select menu to the specified channel
      await channel.send({ embeds: [embed], components: [actionRow] });

      await interaction.followUp({ content: 'Ticket system has been set up successfully!', ephemeral: true });

    } catch (error) {
      console.error('Error executing /ticketsetup command:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
