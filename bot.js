const { Canvas } = require('canvas');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Function to register commands
const registerCommands = async () => {
  try {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);
    await rest.put(Routes.applicationGuildCommands(client.user.id, '860512303233236992'), {
      body: commands,
    });

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};

const cron = require('node-cron');
const { spawn } = require('child_process');

//Fnction to run the checkVouchers script daily
function runCheckVouchersScript() {
  try {
    // Use node-cron to schedule the script to run daily
    cron.schedule('0 0 * * *', () => {
      console.log('Running checkVouchers script...');
      const checkVouchersProcess = spawn('node', ['scripts/checkVouchers.js']);

      checkVouchersProcess.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      checkVouchersProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      checkVouchersProcess.on('exit', (code) => {
        console.log(`checkVouchers script exited with code ${code}`);
      });
    });
  } catch (error) {
    console.error('Error running checkVouchers script:', error);
  }
  }
// Event handler when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}.`);
  registerCommands();
  runCheckVouchersScript();
});

// Event handler for slash command interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const commandName = interaction.commandName;
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
  }
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const eventHandler = require(`./events/${file}`);
  if (eventHandler.name === 'interactionCreate') {
    client.on('interactionCreate', eventHandler.execute);
  } else {
    client.on(eventHandler.name, eventHandler.execute);
  }
}

// Log in the bot
client.login(BOT_TOKEN);
