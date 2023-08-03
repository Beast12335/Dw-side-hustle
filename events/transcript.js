const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');

module.exports = async (channel) => {
  try {
    // Fetch all messages in the channel
    const messages = await channel.messages.fetch({ limit: 100 });
    const messageData = messages.map((msg) => `${msg.createdAt.toISOString()} | ${msg.author.tag} (${msg.author.id}): ${msg.content}`);

    // Create a .doc file with the message data
    const fileName = `${channel.name}-transcript.doc`;
    fs.writeFileSync(fileName, messageData.join('\n'));

    // Send the transcript file as an attachment in the channel
    const transcriptAttachment = new AttachmentBuilder(fileName);
    await channel.send({ files: [transcriptAttachment] });

    // Delete the transcript file after sending
    fs.unlinkSync(fileName);

  } catch (error) {
    console.error('Error generating and sending transcript:', error);
  }
};
