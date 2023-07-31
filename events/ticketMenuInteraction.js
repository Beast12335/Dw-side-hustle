const { Client, MessageEmbed } = require('discord.js');

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

      // Send the welcome embed in the ticket channel
      const welcomeEmbed = new MessageEmbed()
        .setTitle(`Welcome to your ${selectedType} Ticket!`)
        .setDescription('Please be patient and avoid pinging. Our support team will assist you shortly.')
        .setColor('#00ff00')
        .addField('Claim', 'Claim this ticket', true)
        .addField('Users', 'View users in this ticket', true)
        .addField('Role', 'Assign a role to this ticket', true)
        .addField('Close', 'Close this ticket', true)
        .addField('Delete', 'Delete this ticket', true)
        .addField('Transcript', 'Get the transcript of this ticket', true);

      await ticketChannel.send({ embeds: [welcomeEmbed] });

    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  },
};
