const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up the server.')
    .setDefaultPermission(false), // Default permission set to false to be managed with the role permissions

  async execute(interaction) {
      await interaction.deferReply()
    // Check if the user is an admin (you may need to customize this check based on your admin role)
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Create the select menu with options and emojis
    const selectMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('setup')
          .setPlaceholder('Select a ticket option')
          .addOptions([
            {
              label: 'Staff Ticket',
              description: 'Make a staff ticket.',
              value: 'staff',
              emoji: '👤', // Replace with the emoji ID or Unicode emoji
            },
            {
              label: 'Support Ticket',
              description: 'Make a support ticket.',
              value: 'support',
              emoji: '📞', // Replace with the emoji ID or Unicode emoji
            },
            {
              label: 'Partnership Ticket',
              description: 'Make a partnership ticket.',
              value: 'partner',
              emoji: '🤝', // Replace with the emoji ID or Unicode emoji
            },
          ])
      );

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle('Create a partnership/support ticket')
      .setDescription(`> If you need help, want to apply or want to request a custom Service / Support, then open a Ticket.
      
      You are not sure what to do?
      
      Simply use our F.A.Q  or create a General Support Ticket
      
      
      To open a Ticket, select in the Menu down below, the correct Category-Type for your needs!`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || '')
      .setFooter({text:`Design Wonderland`,url: interaction.guild.iconURL({ dynamic: true }) || ''});

    // Send the embed with the select menu
    interaction.channel.send({ embeds: [embed], components: [selectMenu] });
    interaction.followUp({content:'Done'})
  },
};
