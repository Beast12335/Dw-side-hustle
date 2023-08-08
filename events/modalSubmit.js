const { ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'form') return;

    try {
      const q1 = interaction.fields.getTextInputValue('q1')
      const q2 = interaction.fields.getTextInputValue('q2')
      const q3 = interaction.fields.getTextInputValue('q3')
      
      const embed = new EmbedBuilder()
      .setTitle('Form Submission')
      .setColor('#ff00f0')
      .setDescription(`${interaction.user.username} says:
      1. What do you want to order?
      > ${q1}
      2. Tell us more about your order
      > ${q2}
      3. Any inspiration or source for your order?
      > ${q3}`);
      
      await interaction.reply({ embeds: [embed]});

    } catch (error) {
      console.error('Error handling modal submit button interaction:', error);
    }
  },
};
