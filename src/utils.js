const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const connection = require('./connection.js')
const fs = require('fs');


/**
 * Retorna uma promise com a query a ser executada
 * @param  {...any} args 
 * @returns {Promise}
 */
async function query(...args) {
    return new Promise((resolve, reject) => {
        connection.query(...args, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(result)
        })
    })
}

module.exports = {
    query
}

const CHAR_LIST = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'
const CHAR_LIST_LENGTH = CHAR_LIST.length

const randomKey = (keyLength = 16) => {
    let key = ''
    for (let i = 1; i <= keyLength; i++) {
      key += CHAR_LIST[Math.floor(Math.random() * CHAR_LIST_LENGTH)]
    }
    return key
  }

async function backup(message) {

    fs.readFile('./src/base.sql', 'utf8', (err, fixedLines) => {
        if (err) {
            console.error(`Erro ao ler arquivo de linhas fixas: ${err.message}`);
            return;
        }

        const sql = 'SHOW TABLES';
        connection.query(sql, (err, result, fields) => {
            if (err) {
                console.error(`Erro ao executar consulta: ${err.message}`);
                return;
            }

            const tables = result.map((table) => table[`Tables_in_${connection.config.database}`]);

            // Cria um loop para obter os dados de cada tabela
            const data = [];
            const promises = tables.map((table) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT * FROM ${table}`;
                    connection.query(sql, (err, result, fields) => {
                        if (err) {
                            reject(`Erro ao executar consulta: ${err.message}`);
                            return;
                        }
                        if (!result || !result.length) {
                            resolve();
                            return;
                        }
                        data.push({ table, rows: result });
                        resolve();
                    });
                });
            });

            Promise.all(promises).then(() => {         
                let dump = fixedLines + '\n\n';

                data.map(({ table, rows }) => {
                    if (!rows || !rows.length) {
                        return '';
                    }
                    const insertRows = rows.map((row) => `(${Object.values(row).map((v) => `"${v}"`).join(', ')})`).join(',\n');
                    dump += `-- Tabela: ${table}\n`;
                    dump += `INSERT INTO ${table} (${Object.keys(rows[0]).join(', ')}) VALUES\n${insertRows};\n\n`;
                });
                fs.writeFileSync('backup.sql', dump);
                const attachment = new AttachmentBuilder()
                        .setFile('backup.sql')

                    message.channel.send({ files: [attachment] });
            }).catch((err) => {
                console.error(err);
            });
        });
    });
}

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

        if (lastBotMessage && botMessages.size > 2) {
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

    const suggestionMessage = await suggestionChannel.send({ embeds: [embedUser] });
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

module.exports.randomKey = randomKey;
module.exports.closeTicket = closeTicket;
module.exports.backup = backup;
module.exports.sendMemberSuggestion = sendMemberSuggestion;