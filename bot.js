const { Canvas } = require('canvas');
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
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
    await rest.put(Routes.applicationGuildCommands(client.user.id, 'YOUR_GUILD_ID'), {
      body: commands,
    });

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};

// Event handler when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}.`);
  registerCommands();
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

// Log in the bot
client.login(BOT_TOKEN);
