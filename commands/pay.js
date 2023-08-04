const { SlashCommandBuilder } = require('@discordjs/builders');

const paypalLinks = {
  Tanki: 'https://www.paypal.me/tanki667',
  Prithvi: 'https://www.paypal.me/prithvirajghorpade',
  Icy: 'https://www.paypal.me/icyalfred',
  Sanchit: 'https://www.paypal.me/Rinkiinterprices',
};

const paytmNumber = '9050661960@paytm';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Place a payment order.')
    .addStringOption(option =>
      option
        .setName('order')
        .setDescription('Items ordered.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('cost')
        .setDescription('Price of the order.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('user')
        .setDescription('Choose the user for payment.')
        .setRequired(true)
        .addChoices({name:'Tanki', value:'Tanki'},
                    {name:'Prithvi', value:'Prithvi'},
                    {name:'Icy', value:'Icy'},
                    {name:'Sanchit', value:'Sanchit'})
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply()
      const order = interaction.options.getString('order');
      const cost = interaction.options.getString('cost');
      const user = interaction.options.getString('user');
      const paypalLink = paypalLinks[user];

      const response = `As per our company policy, payment has to be done 1st before we can deliver the product.\n\nItems ordered: ${order}\n\nPrice: ${cost}\n\nPlease send the payment to:\n[PayPal](${paypalLink}) or Paytm: ${paytmNumber}\n\nDrop us a screenshot after sending, thanks.\n\nRegards,\nDesign Wonderland Management`;

      await interaction.followUp(response);
    } catch (error) {
      console.error('Error executing /pay command:', error);
      await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};
