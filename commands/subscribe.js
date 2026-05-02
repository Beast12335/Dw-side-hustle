const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe via PayPal'),

  async execute(interaction) {

    const url = `https://ninja-subscription.vercel.app/?discordId=${interaction.user.id}`;

    const button = new ButtonBuilder()
      .setLabel("Subscribe Now")
      .setStyle(ButtonStyle.Link)
      .setURL(url);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: "Click below to subscribe:",
      components: [row]
    });
  }
};
