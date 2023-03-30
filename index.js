const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
const config = require('./config.json');
const commands = require('./commands/commands.js');

client.commands = new Collection();

client.on('ready', async () => {
    console.log('Bot ligado e pronto para utilizar!');
    await client.user.setActivity('Wise Evolution');
});

client.on('messageCreate', async message => {

    //IGNORA OS BOTS
    if (message.author.bot)
        return

    //IGNORA AS MENSAGENS PRIVADAS
    if (message.channel.type === 'dm')
        return

    if (message.content[0] != config.prefix) {
        return
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    commands(message, command, args);
});

client.login(config.token);
