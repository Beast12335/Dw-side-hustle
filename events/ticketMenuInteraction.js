const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField,ButtonStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'ticket_type')return;

    try {
      // Get the selected value from the select menu
      const selectedType = interaction.values[0];

      // Create the ticket channel in the category with ID 294829283
      const categoryID = '914051161068302337';
      const ticketChannel = await interaction.guild.channels.create({name:`🎟️•gfx•${interaction.user.username}`,
        type: 0,
        parent: categoryID,
        topic: `Ticket type: ${selectedType}\nCreated at: ${new Date().toLocaleString()}`,
        permissionOverwrites:[{
          id: interaction.guild.id,
          deny: PermissionsBitField.Flags.ViewChannel},
                              {
                                id: interaction.user.id,
                                allow: PermissionsBitField.ViewChannel}]
      });
      //await ticketChannel.permissionOverwrites.create(interaction.guild.id,{ViewChannel:false});
      // Send an ephemeral message indicating the ticket creation
      await interaction.reply({ content: 'Ticket has been created!', ephemeral: true });

      // Create the action row for buttons
      const actionRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('claim_ticket')
            .setLabel('Claim')
            .setStyle('Primary'),
          new ButtonBuilder()
            .setCustomId('view_users')
            .setLabel('Users')
            .setStyle('Primary'),
          new ButtonBuilder()
            .setCustomId('assign_role')
            .setLabel('Role')
            .setStyle('Primary'),
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close')
            .setStyle('Danger'),
          new ButtonBuilder()
            .setCustomId('delete_ticket')
            .setLabel('Delete')
            .setStyle('Danger')
          );
    const action = new ActionRowBuilder()
     .addComponents(
          new ButtonBuilder()
            .setCustomId('get_transcript')
            .setLabel('Transcript')
            .setStyle('Secondary')
        );

      // Send the welcome embed with buttons in the ticket channel
      const welcomeEmbed = new EmbedBuilder()
        .setTitle(` Ticket for ${interaction.user.username}`)
        .setDescription(`Welcome, <@${interaction.user.id}> 

Thank you opening a ticket.  **Please let us know the following details about your order:**
          
**__1. What do you want to order? 
    2. Any specific designs or colors? 
    3. If available,kindly provide link to the inspiration for the design.__**
          
Thank you for the kind cooperation`)
        .setColor('#00ff00');

      await ticketChannel.send({content:`<@${interaction.user.id}> <@914051146807668806> <@914051147495538738> <@914051151169716245>`,embeds: [welcomeEmbed], components: [actionRow,action] });

    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  },
};
