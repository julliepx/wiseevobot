//ARQUIVOS DE COMANDOS
const admin = require('./admin');

const roles = require('../src/roles.js');
const permissions = require('../src/permissions.js');

//CHAMADA DE ARQUIVOS DE COMANDOS
const commands = {
    ...admin
}

module.exports = async (message, command, arguments) => {

    if (!commands[command] || !permissions[command]) {
        return
    }

    const allowed = permissions[command](message, arguments.length)

    if (allowed !== permissions.ALLOW.NOT_ALLOWED) {
        try {
            await commands[command](message, arguments, allowed)
        } catch (e) {
            console.log(e, message)
        }
    } else {
        message.reply('Você não tem permissão para executar esse comando!')
    }
}