const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');
const mysql = require('mysql2/promise');
require('dotenv').config();
//const db = process.env.DB_URL;

const CODE_LENGTH = 6;
const CODE_EXPIRY_MONTHS = 2;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generatevoucher')
    .setDescription('Generate a voucher code.')
    .setDefaultPermission(false),

  async execute(interaction) {
    await interaction.deferReply()
    try {
     // await interaction.deferReply()
      // Check if the user has admin permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ADMINISTRATOR)) {
        return await interaction.followUp({ content: 'You need admin permissions to use this command.', ephemeral: true });
      }

      // Connect to the MySQL server
      const connection = await mysql.createConnection(process.env.DB_URL);
                                             
      console.log('Connected to MySQL server.');

      // Generate a random alphanumeric code
      let voucherCode = generateRandomCode(CODE_LENGTH);

      // Check if the code already exists in the table
      let isCodeExists = true;
      while (isCodeExists) {
        const [rows] = await connection.execute('SELECT * FROM voucher WHERE code = ?', [voucherCode]);
        if (rows.length === 0) {
          isCodeExists = false;
        } else {
          voucherCode = generateRandomCode(CODE_LENGTH);
        }
      }

      // Calculate the expiry date
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + CODE_EXPIRY_MONTHS);

      // Insert the voucher details into the table
      await connection.execute('INSERT INTO voucher (code,valid, date) VALUES (?,?, ?)', [voucherCode,'active', expiryDate]);

      // Generate QR code
      const qrCodeCanvas = createCanvas(500, 500);
      await QRCode.toCanvas(qrCodeCanvas, voucherCode, { width: 500 });

      // Create the main canvas
      const canvas = createCanvas(1502, 1002);
      const ctx = canvas.getContext('2d');

      // Load the background image
      const background = await loadImage('https://media.discordapp.net/attachments/916149747180511294/1079635234766725260/offer.png');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Set the font properties
      ctx.font = '65px bold "Arial"';
      ctx.fillStyle = 'white';

      // Write the voucher code
      ctx.fillText(voucherCode, 405, 936);

      // Draw the QR code
      ctx.drawImage(qrCodeCanvas, 130, 255, 500, 500);
      ctx.font = "bold 50px Arial"
      // Write the expiry date
      ctx.fillText(`${expiryDate.toDateString().slice(4,new Date(expiryDate).toDateString().length)}`, 1150, 763);

      // Save the canvas as a Discord attachment
      const attachment = new AttachmentBuilder(canvas.toBuffer(), 'voucher.png');

      // Success message with the voucher code and QR code
      const successMessage = `Voucher generated successfully! Here's your voucher code: ${voucherCode}`;

      await interaction.followUp({ content: successMessage, files: [attachment] });

      // Close the MySQL connection
      await connection.end();

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
