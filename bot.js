const { Canvas } = require('canvas');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

/* ================= EXPRESS SERVER ================= */

const app = express();
app.use(cors());
app.use(express.json());

// ✅ REQUIRED FOR RAILWAY
const PORT = process.env.PORT || 3000;

// ✅ TEST ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is alive 🚀");
});

// 🔁 TEMP STORAGE (no DB as per your requirement)
const userMap = new Map();

// ✅ STORE subscription → discord user
app.post("/api/store", (req, res) => {
  const { subscriptionID, discordId } = req.body;

  if (!subscriptionID || !discordId) {
    return res.status(400).send("Missing data");
  }

  userMap.set(subscriptionID, discordId);

  console.log("Stored:", subscriptionID, discordId);

  res.sendStatus(200);
});

// ✅ PAYPAL WEBHOOK HANDLER
app.post("/webhook", async (req, res) => {
  const event = req.body;

  console.log("Webhook received:", event.event_type);

  const subscriptionID = event?.resource?.id;

  if (!subscriptionID) return res.sendStatus(200);

  const discordId = userMap.get(subscriptionID);

  if (!discordId) {
    console.log("No mapping found for:", subscriptionID);
    return res.sendStatus(200);
  }

  try {
    const channel = await client.channels.fetch("1149237879348924476");

    // ✅ SUBSCRIBED
    if (event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      await channel.send(`✅ <@${discordId}> subscribed successfully!`);
    }

    // ❌ CANCELLED
    if (event.event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
      await channel.send(`❌ <@${discordId}> cancelled their subscription.`);
    }

    // ⚠️ SUSPENDED
    if (event.event_type === "BILLING.SUBSCRIPTION.SUSPENDED") {
      await channel.send(`⚠️ <@${discordId}> subscription got suspended.`);
    }

  } catch (err) {
    console.error("Webhook error:", err);
  }

  res.sendStatus(200);
});

// ✅ START SERVER (FIXED)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ================= DISCORD BOT ================= */

// Register slash commands
const registerCommands = async () => {
  try {
    const commands = [];
    const commandFiles = fs
      .readdirSync('./commands')
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    }

    const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
};

const cron = require('node-cron');
const { spawn } = require('child_process');

// Daily script
function runCheckVouchersScript() {
  cron.schedule('0 0 * * *', () => {
    console.log('Running checkVouchers script...');

    const process = spawn('node', ['scripts/checkVouchers.js']);

    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    process.on('exit', (code) => {
      console.log(`Script exited with code ${code}`);
    });
  });
}

// Ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  registerCommands();
  runCheckVouchersScript();
});

// MongoDB (optional for you)
mongoose
  .connect(process.env.mongo)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction);
  }
});

// Load events
const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const eventHandler = require(`./events/${file}`);
  client.on(eventHandler.name, (...args) =>
    eventHandler.execute(...args)
  );
}

// Login bot
client.login(BOT_TOKEN);
