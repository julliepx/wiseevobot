//EMBEDS
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { closeTicket } = require('../src/utils.js');
const fs = require('fs');

//ENVIAR UM EMBED PASSANDO UM JSON = !say
module.exports.say = async (message) => {

    const messageContent = message.content.substring(5);
    const messageJson = JSON.parse(messageContent);

    console.log(messageJson.embeds);

    const embed = new EmbedBuilder()
        .setColor('#007FFF')
        .setDescription(messageJson.embeds[0].description)
        .setTimestamp()

    if (messageJson.embeds[0].image) {
        embed.setImage(messageJson.embeds[0].image);
    }

    if (messageJson.embeds[0].footer) {
        if (messageJson.embeds[0].footer.text && messageJson.embeds[0].footer.icon_url) {
            embed.setFooter({ text: messageJson.embeds[0].footer.text, iconURL: messageJson.embeds[0].footer.icon_url });
        } else if (messageJson.embeds[0].footer.text) {
            embed.setFooter({ text: messageJson.embeds[0].footer.text, iconURL: null });
        } else if (messageJson.embeds[0].footer.icon_url) {
            embed.setFooter({ text: null, iconURL: messageJson.embeds[0].footer.icon_url });
        } else {
            message.channel.send('Você não colocou alguma informação no footer do embed!');
        }
    }

    if (messageJson.embeds[0].title) {
        embed.setTitle(messageJson.embeds[0].title);
    }

    if (messageJson.embeds[0].thumbnail) {
        embed.setThumbnail(messageJson.embeds[0].thumbnail);
    }

    if (messageJson.embeds[0].author) {
        if (messageJson.embeds[0].author.name && messageJson.embeds[0].author.icon_url) {
            embed.setAuthor({ name: messageJson.embeds[0].author.name, iconURL: messageJson.embeds[0].author.icon_url });
        } else if (messageJson.embeds[0].author.name) {
            embed.setAuthor({ name: messageJson.embeds[0].author.name, iconURL: null });
        } else if (messageJson.embeds[0].author.icon_url) {
            embed.setAuthor({ name: null, iconURL: messageJson.embeds[0].author.icon_url });
        }
    }

    messageJson.embeds[0].fields.forEach(field => {
        embed.addFields({ name: field.name, value: field.value, inline: field.inline });
    });

    message.delete();
    message.channel.send({ embeds: [embed] });
}

module.exports.createticket = async (message) => {
    const embed = new EmbedBuilder()
        .setTitle('Wise Suporte')
        .setColor('#2b2d31')
        .setDescription('`❓️` **Suporte Geral**\n・Está tendo algum problema ou deseja fechar algum tipo de parceria? Abra um ticket abaixo.\n\n`🛠️` **Bug Reports**\n・Encontrou algum problema no servidor, que tal receber uma recompensa? Abra um ticket abaixo.\n\n`🚫` **Denúncias**\n・Deseja reportar algum jogador suspeito? Abra um ticket abaixo.\n\n`💵` **Compras**\n・Fez alguma compra no site e não recebeu? Abra um ticket abaixo.')
        .setAuthor({ name: 'Tickets | Wise Evolution', iconURL: null })
        .setColor('#007FFF')
        .setFooter({ text: 'Wise Suporte' })
        .setImage('https://cdn.discordapp.com/attachments/792875068556312587/1091061318779404408/ticket.png');

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket-select')
                .setPlaceholder('Selecione uma opção')
                .addOptions({
                    label: '❓️ Suporte',
                    description: 'Clique aqui para abrir um TICKET para Suporte.',
                    value: 'suporte',
                },
                {
                    label: '🛠️ Bug Reports',
                    description: 'Clique aqui para abrir um TICKET para Reportar.',
                    value: 'reportar',
                },
                {
                    label: '🚫 Denúncias',
                    description: 'Clique aqui para abrir um TICKET para Denunciar.',
                    value: 'denuncia',
                },
                {
                    label: '💵 Compras',
                    description: 'Clique aqui para abrir um TICKET para Comprar.',
                    value: 'compra',
                }));

    await message.delete();
    await message.channel.send({ embeds: [embed], components: [row] });
}

module.exports.close = async (message) => {
    closeTicket(message);
}