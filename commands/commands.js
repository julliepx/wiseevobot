//ARQUIVOS DE COMANDOS
const admin = require('./admin');

//EMBEDS
const { EmbedBuilder } = require('discord.js');

//CHAMADA DE ARQUIVOS DE COMANDOS
const commands = {
    ...admin
}

module.exports = async (message, command, arguments) => {

    if (!commands[command]) {
        return
    }

    try {
        await commands[command](message, arguments)
    } catch (e) {
        console.log(e, message)
    }
}