const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

async function closeTicket(message) {
    const messages = await message.channel.messages.fetch();
    const messagesRightOrder = messages.reverse();
    const transcript = messagesRightOrder.map(message => `<p><strong>${message.author.username}:</strong> ${message.content}</p>`).join('\n');

    const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Transcript</title>
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f2f2f2;
        }

        h1 {
            padding-top: 80px;
            text-align: center;
            font-size: 30px;
            font-family: Arial, Helvetica, sans-serif;
            margin-bottom: 10px;
        }

        p {
            background-color: #b6b6b6;
            border-radius: 8px;
            margin-bottom: 10px;
            align-self: flex-start;
            padding: 20px;
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;
        }

        .messages {
            width: 60%;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            padding: 10px;
        }
        </style>
    </head>
    <body>
        <h1>Transcript</h1>
        <div class="messages">
        ${transcript}
        </div>
    </body>
    </html>
    `;

    const fs = require('fs');
    fs.writeFileSync('transcript.html', html);

    const attachment = new AttachmentBuilder()
        .setFile('transcript.html')

    await message.guild.channels.cache.get('1083589040739192862').send({ files: [attachment] });
    await message.channel.delete();
}

async function sendMemberSuggestion(message) {
    message.channel.messages.fetch().then(messages => {

        const botMessages = messages.filter(msg => msg.author.id === '1090718591093047316');
        const lastBotMessage = botMessages.first();

        if(lastBotMessage && botMessages.size > 2){
            lastBotMessage.delete();
        } else {
            return;
        }
    })

    const suggestion = message.content;
    const suggestionChannel = message.guild.channels.cache.get('1080615600310730864');

    const embedUser = new EmbedBuilder()
        .setTitle(message.author.username)
        .setColor('#2b2d31')
        .setDescription(`📝 **Sugestão:**\n ${suggestion}`);

    const suggestionMessage = await suggestionChannel.send({ embeds: [embedUser]});
    await suggestionMessage.react('👍');
    await suggestionMessage.react('👎');
    
    const embedBot = new EmbedBuilder()
        .setTitle('Wise Suporte')
        .setColor('#2b2d31')
        .setDescription('`📝` **Sugestões**\n・Deseja sugerir algo para o servidor? Digite sua sugestão detalhadamente abaixo.')
        .setAuthor({ name: 'Sugestões | Wise Evolution', iconURL: null })
        .setColor('#007FFF')
        .setFooter({ text: 'Wise Suporte' })
        .setImage('https://cdn.discordapp.com/attachments/792875068556312587/1091061318779404408/ticket.png');

    await message.channel.send({ embeds: [embedBot] });
    await message.delete();
}

module.exports.closeTicket = closeTicket;
module.exports.sendMemberSuggestion = sendMemberSuggestion;