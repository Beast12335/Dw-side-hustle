const { Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    try {
      // Get the selected value from the select menu
      const selectedType = interaction.values[0];

      // Create the ticket channel in the category with ID 294829283
      const categoryID = '294829283';
      const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        type: 'GUILD_TEXT',
        parent: categoryID,
        topic: `Ticket type: ${selectedType}\nCreated at: ${new Date().toLocaleString()}`,
      });

      // Send an ephemeral message indicating the ticket creation
      await interaction.reply({ content: 'Ticket has been created!', ephemeral: true });

      // Create the action row for buttons
      const actionRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('claim_ticket')
            .setLabel('Claim')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('view_users')
            .setLabel('Users')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('assign_role')
            .setLabel('Role')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('close_ticket')
            .setLabel('Close')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId('delete_ticket')
            .setLabel('Delete')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId('get_transcript')
            .setLabel('Transcript')
            .setStyle('SECONDARY')
        );

      // Send the welcome embed with buttons in the ticket channel
      const welcomeEmbed = new MessageEmbed()
        .setTitle(`Welcome to your ${selectedType} Ticket!`)
        .setDescription('Please be patient and avoid pinging. Our support team will assist you shortly.')
        .setColor('#00ff00');

      await ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow] });

    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  },
};
