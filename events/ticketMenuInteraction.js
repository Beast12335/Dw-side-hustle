const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    try {
      // Get the selected value from the select menu
      const selectedType = interaction.values[0];

      // Create the ticket channel in the category with ID 294829283
      const categoryID = '860512303233236994';
      const ticketChannel = await interaction.guild.channels.create({name:`ticket-${interaction.user.username}`,
        type: 0,
        parent: categoryID,
        topic: `Ticket type: ${selectedType}\nCreated at: ${new Date().toLocaleString()}`,
      });
      await ticketChannel.permissionOverwrites.create(interaction.guild.id,{ViewChannel:false});
      // Send an ephemeral message indicating the ticket creation
      await interaction.reply({ content: 'Ticket has been created!', ephemeral: true });

      // Create the action row for buttons
      const actionRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('claim_ticket')
            .setLabel('Claim')
            .setStyle('ButtonStyle.Primary'),
          new ButtonBuilder()
            .setCustomId('view_users')
            .setLabel('Users')
            .setStyle('ButtonStyle.Primary'),
          new ButtonBuilder()
            .setCustomId('assign_role')
            .setLabel('Role')
            .setStyle('ButtonStyle.Primary'),
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close')
            .setStyle('ButtonStyle.Danger'),
          new ButtonBuilder()
            .setCustomId('delete_ticket')
            .setLabel('Delete')
            .setStyle('ButtonStyle.Danger'),
          new ButtonBuilder()
            .setCustomId('get_transcript')
            .setLabel('Transcript')
            .setStyle('ButtonStyle.Secondary')
        );

      // Send the welcome embed with buttons in the ticket channel
      const welcomeEmbed = new EmbedBuilder()
        .setTitle(`Welcome to your ${selectedType} Ticket!`)
        .setDescription('Please be patient and avoid pinging. Our support team will assist you shortly.')
        .setColor('#00ff00');

      await ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow] });

    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  },
};
