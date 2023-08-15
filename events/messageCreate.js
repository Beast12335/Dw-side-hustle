const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    const connection = await mysql.createConnection(process.env.DB_URL)
    console.log('connected to mysql db')
    try {
          const expired = 3;
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + expired);
      if(message.channelId == '860512303233236995'){
        await message.react('👍🏻')
        await connection.end()
        }
      else if(message.channelId == '914051176192954388'){
        await connection.execute('insert into money values(?,?,?,?)',[message.author.id,message.author.username,'0.1',expiryDate]);
      }
      else if(message.channelId == '914051175450570792'){
        if(message.author.bot){
          const msg = message.content.slice(0,19)

          if(message.includes('add'){
            await connection.execute('insert into money(user,balance,expiry) values(?,?,?)',[msg,'0.5',expiryDate]);
          }
          else if(message.includes('remove'){
            await connection.execute('insert into money(user,balance,expiry) values(?,?,?)',[msg,'-0.5',expiryDate]);
          }
        }
      }
    } catch (error) {
      console.error('Error handling message create:', error);
    }
  },
};
