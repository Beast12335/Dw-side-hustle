const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, AttachmentBuilder } = require('discord.js');
const { createCanvas,loadImage } = require('canvas');
const QRCode = require('qrcode');
const Voucher = require('../db/vouchers.js');
require('dotenv').config();

const CODE_LENGTH = 6;
const CODE_EXPIRY_MONTHS = 2;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generatevoucher')
    .setDescription('Generate a voucher code.')
    .setDefaultPermission(false),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      // Generate a random alphanumeric code
      let voucherCode = generateRandomCode(CODE_LENGTH);

      // Check if the code already exists in the database
      let isCodeExists = true;
      while (isCodeExists) {
        const existingVoucher = await Voucher.findOne({ code: voucherCode });
        if (!existingVoucher) {
          isCodeExists = false;
        } else {
          voucherCode = generateRandomCode(CODE_LENGTH);
        }
      }

      // Calculate the expiry date
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + CODE_EXPIRY_MONTHS);

      // Save the voucher to the database
      await Voucher.create({ code: voucherCode, valid: "active", date: expiryDate });

      // Generate QR code
      const qrCode = await QRCode.toBuffer(voucherCode, { width: 500 });

      // Create the canvas
      const canvas = createCanvas(1502, 1002);
      const ctx = canvas.getContext('2d');

      // Draw background image
      const background = await loadImage('https://media.discordapp.net/attachments/916149747180511294/1079635234766725260/offer.png');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw voucher code
      ctx.font = '65px bold "Arial"';
      ctx.fillStyle = 'white';
      ctx.fillText(voucherCode, 405, 936);

      // Draw QR code
      const qrImage = new AttachmentBuilder(qrCode, 'qrcode.png');
      ctx.drawImage(await loadImage(qrImage.url), 130, 255, 500, 500);

      // Draw expiry date
      ctx.font = 'bold 50px Arial';
      ctx.fillText(`${expiryDate.toDateString().slice(4)}`, 1150, 763);

      // Convert canvas to buffer and send as attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), 'voucher.png');
      const successMessage = `Voucher generated successfully! Here's your voucher code: ${voucherCode}`;

      await interaction.followUp({ content: successMessage, files: [attachment] });

    } catch (error) {
      console.error('Error executing /generatevoucher command:', error);
      await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
    }
  },
};

function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
