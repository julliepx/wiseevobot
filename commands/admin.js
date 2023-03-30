//EMBEDS
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

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
            embed.setFooter({ text: messageJson.embeds[0].footer.text, iconURL: null});
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
            embed.setAuthor({ name: messageJson.embeds[0].author.name, iconURL: null});
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
