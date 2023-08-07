const { Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField,ButtonStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'setup') return;
    try {
      // Get the selected value from the select menu
      const selectedType = interaction.values[0];
      const category ={
        'partner':917382143959781406,
        'staff':917382026108215347,
        'support':917381935372832769}
      const message = {
        'partner':`Hlo <@${interaction.user.id}>.
        Welcome to **__Design Wonderland.__**
        Thanks for making a ticket. Pls answer a few questions. 
                    
         1. Share your server link
         2. Why do want to partner with us? 
         3. How will our server benefitted with this partnership? 
         4. Do you have any suggestions for our server? If yes, please share them.`,
        'staff':`Welcome <@${interaction.user.id}>
        Thanks for applying!!
                      
        Please answer the questions below :
                      
         1. Introduce yourself.
         2. Which role are you applying for?
         3. How can you help us as that role?
         4. If you are applying as an artist or designer, kindly show us your works.`,
        'support':`Hey <@${interaction.user.id}>, thanks for opening an ticket! Someone will help you soon!  Please describe your issue as much as possible and don't ping anybody as pinging won't get you faster support`
        }
      // Create the ticket channel in the category with ID 294829283
      const ticketChannel = await interaction.guild.channels.create({name:`🎟️•${selectedType}•${interaction.user.username}`,
        type: 0,
        parent: category[selectedType],
        topic: `Ticket type: ${selectedType}\nCreated at: ${new Date().toLocaleString()}`,
        permissionOverwrites:[{
          id: interaction.guild.id,
          deny: PermissionsBitField.Flags.ViewChannel},
                              {
                                id: interaction.user.id,
                                allow: PermissionsBitField.ViewChannel},
                               /* {id:914051151169716245,
                                allow: PermissionsBitField.ViewChannel
                                }*/
                                ]
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
            .setStyle('Success'),
          new ButtonBuilder()
            .setCustomId('assign_role')
            .setLabel('Role')
            .setStyle('Success'),
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
           ${message[selectedType]}`)
        .setColor('#00ff00');

      await ticketChannel.send({content:`<@${interaction.user.id}> <@&914051146807668806> <@&914051147495538738> <@&914051151169716245>`,embeds: [welcomeEmbed], components: [actionRow,action] });

    } catch (error) {
      console.error('Error handling select menu interaction:', error);
    }
  },
};
