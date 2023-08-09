const {mysql} = require('mysql2/promise');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const connection = await mysql.createConnection(process.env.DB_URL)
    console.log('connected to mysql db')
    try {
      if(message.channelId = '860512303233236995'){
        await connection.execute('update money set balance = balance +0.1 where user = ?',[message.author.id])
        await message.react('👍🏻')
        await connection.end()
        }
    } catch (error) {
      console.error('Error handling message create:', error);
    }
  },
};
