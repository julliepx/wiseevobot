const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
const config = require('./config.json');
//const commands = require('./commands/commands.js');

//client.commands = new Collection();

client.on('ready', async () => {
    console.log('Bot ligado e pronto para utilizar!');
    await client.user.setActivity('Wise Evolution');
});

client.login(config.token);
