const { Client, Collection, GatewayIntentBits, ChannelType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
const config = require('./config.json');
const fs = require('fs');
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

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Suporte
const channelNumberFileSuporte = './channelNumberSuporte.txt';
if (!fs.existsSync(channelNumberFileSuporte)) {
    fs.writeFileSync(channelNumberFileSuporte, '0');
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Reportar
const channelNumberFileReportar = './channelNumberReportar.txt';
if (!fs.existsSync(channelNumberFileReportar)) {
    fs.writeFileSync(channelNumberFileReportar, '0');
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Denuncia
const channelNumberFileDenuncia = './channelNumberDenuncia.txt';
if (!fs.existsSync(channelNumberFileDenuncia)) {
    fs.writeFileSync(channelNumberFileDenuncia, '0');
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Compra
const channelNumberFileCompra = './channelNumberCompra.txt';
if (!fs.existsSync(channelNumberFileCompra)) {
    fs.writeFileSync(channelNumberFileCompra, '0');
}
client.on('interactionCreate', async interaction => {
    const message = '<@&1083238906587271208>';
    const embedSuporte = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`Ticket aberto por <@${interaction.user.id}>`)
        .setFooter({ text: 'Atenciosamente, Wise Evolution ©️ Todos direitos reservados.', iconURL: null })
        .addFields({
            name: 'Assunto',
            value: '```Este ticket foi aberto para suporte geral.```',
            inline: false
        })
    const embedCompra = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`Ticket aberto por <@${interaction.user.id}>`)
        .setFooter({ text: 'Atenciosamente, Wise Evolution ©️ Todos direitos reservados.', iconURL: null })
        .addFields({
            name: 'Assunto',
            value: '```Este ticket foi aberto para aquisição de pacotes oferecidos pelo servidor.```',
            inline: false
        })
    const embedDenuncia = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`Ticket aberto por <@${interaction.user.id}>`)
        .setFooter({ text: 'Atenciosamente, Wise Evolution ©️ Todos direitos reservados.', iconURL: null })
        .addFields({
            name: 'Assunto',
            value: '```Este ticket foi aberto para denúncias de diversos tipos.```',
            inline: false
        })
    const embedReportar = new EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`Ticket aberto por <@${interaction.user.id}>`)
        .setFooter({ text: 'Atenciosamente, Wise Evolution ©️ Todos direitos reservados.', iconURL: null })
        .addFields({
            name: 'Assunto',
            value: '```Este ticket foi aberto para reportar algum erro encontrado no servidor.```',
            inline: false
        })

    const selected = interaction.values[0];
    const guild = interaction.guild;
    const currentChannelNumberSuporte = parseInt(fs.readFileSync(channelNumberFileSuporte, 'utf8'));
    const currentChannelNumberReportar = parseInt(fs.readFileSync(channelNumberFileReportar, 'utf8'));
    const currentChannelNumberDenuncia = parseInt(fs.readFileSync(channelNumberFileDenuncia, 'utf8'));
    const currentChannelNumberCompra = parseInt(fs.readFileSync(channelNumberFileCompra, 'utf8'));

    if (selected === 'suporte') {
        await interaction.deferReply({ ephemeral: true });
        const channelName = `TICKET-SUPORTE-${currentChannelNumberSuporte}`;
        guild.channels.create({ name: channelName, type: ChannelType.GuildText, parent: '1091081468278734878' })
            .then(channel => {
                channel.send({ content: message, embeds: [embedSuporte] })
                interaction.editReply(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                interaction.user.send(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                fs.writeFileSync(channelNumberFileSuporte, `${currentChannelNumberSuporte + 1}`)
            })
            .catch(console.error);
    }

    if (selected === 'compra') {
        await interaction.deferReply({ ephemeral: true });
        const channelName = `TICKET-COMPRA-${currentChannelNumberCompra}`;
        guild.channels.create({ name: channelName, type: ChannelType.GuildText, parent: '1091081377241378917' })
            .then(channel => {
                channel.send({ content: message, embeds: [embedCompra] })
                interaction.editReply(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                interaction.user.send(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                fs.writeFileSync(channelNumberFileCompra, `${currentChannelNumberCompra + 1}`)
            })
            .catch(console.error);
    }

    if (selected === 'denuncia') {
        await interaction.deferReply({ ephemeral: true });
        const channelName = `TICKET-DENUNCIA-${currentChannelNumberDenuncia}`;
        guild.channels.create({ name: channelName, type: ChannelType.GuildText, parent: '1091081406068826182' })
            .then(channel => {
                channel.send({ content: message, embeds: [embedDenuncia] })
                interaction.editReply(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                interaction.user.send(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                fs.writeFileSync(channelNumberFileDenuncia, `${currentChannelNumberDenuncia + 1}`)
            })
            .catch(console.error);
    }

    if (selected === 'reportar') {
        await interaction.deferReply({ ephemeral: true });
        const channelName = `TICKET-REPORT-${currentChannelNumberReportar}`;
        guild.channels.create({ name: channelName, type: ChannelType.GuildText, parent: '1091081435122769930' })
            .then(channel => {
                channel.send({ content: message, embeds: [embedReportar] })
                interaction.editReply(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                interaction.user.send(`Seu ticket foi criado, acesse aqui: <#${channel.id}>`)
                fs.writeFileSync(channelNumberFileReportar, `${currentChannelNumberReportar + 1}`)
            })
            .catch(console.error);
    }
});

client.login(config.token);
