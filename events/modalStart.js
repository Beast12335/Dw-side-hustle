const { ActionRowBuilder, ModalBuilder,TextInputStyle,TextInputBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'modal') return;

    try {
      // Check if the user has admin permissions
      const modal = new ModalBuilder()
      .setTitle('Order Form')
      .setCustomId('form');
      const q1 = new TextInputBuilder()
      .setCustomId('q1')
      .setLabel('What do you wish to order?')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
      const q2 = new TextInputBuilder()
      .setCustomId('q2')
      .setLabel('Tell us more about your order')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
      
      const q3 = new TextInputBuilder()
      .setCustomId('q3')
      .setLabel('Any inspiration or source for your order?')
      .setStyle(TextInputStyle.Paragraph)

     const first = new ActionRowBuilder().addComponents(q1)
     const second = new ActionRowBuilder().addComponents(q2)
     const third = new ActionRowBuilder().addComponents(q3)

     modal.addComponents(first,second,third)
     await interaction.showModal(modal)
      // Send a confirmation message with a red button to confirm the ticket closin
    } catch (error) {
      console.error('Error handling form button interaction:', error);
    }
  },
};
