const { SlashCommandBuilder,Guild } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('free')
    .setDescription('Setup free system.')
    .setDefaultPermission(false),

  async execute(interaction) {
    await interaction.deferReply()
    try {
      //await interaction.deferReply()
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }
      const channel = interaction.channel
      const message = `Order any GFX of your wish 
      In order to get a gfx, you need to meet at least 2 Requirements: 
      -) You are not banned from tickets 
      -) You have enough coins in the wallet 
      __For both boosting and donations, you need mention that in your Order-Ticket__
        
      **__Every type of GFX have their own features and prices__**`
      // Create the embed for ticket setup
      const embed = new EmbedBuilder()
        .setTitle('Create a ticket to get free gfx')
        .setDescription(message)
        .setColor('#ff0000')
        .setThumbnail('https://cdn.discordapp.com/icons/808758266792247297/3c7a14d0f10d9bd3be4921bf0e6be5ca.png')
        .setFooter({text:'Design Wonderland',iconURL:'https://cdn.discordapp.com/icons/808758266792247297/3c7a14d0f10d9bd3be4921bf0e6be5ca.png'})
        .setImage('https://media.discordapp.net/attachments/916149747180511294/1179648739099562034/DW_COINS1.png?ex=658d0180&is=657a8c80&hm=d5fb44ad4fd75450bef1bb957e3ed087c53d3ac2a4c0579eb411b9353c91a0f9&')
        

      // Create a select menu with options from the types array
      const button = new ButtonBuilder()
      .setCustomId('free')
      .setStyle(ButtonStyle.Success)
      .setLabel('Claim GFX')
      .setEmoji('🎟️');

      // Create an action row to hold the select menu
      const actionRow = new ActionRowBuilder()
        .addComponents(button);

      // Send the embed with the select menu to the specified channel
      await channel.send({ embeds: [embed], components: [actionRow] });

      await interaction.followUp({ content: 'Ticket system has been set up successfully!', ephemeral: true });

    } catch (error) {
      console.error('Error executing /ticketsetup command:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
