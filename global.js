const DEBUG = true;

global.CommandError = class CommandError extends Error {
    constructor(message) {
        super(message)
    }
}

global.logError = (error, message) => {
    if (error instanceof CommandError)
        return message.channel.send(error.message)

    if (DEBUG)
        console.error(error)

    message.channel.send('Ocorreu um erro ao executar o comando.')
}

process.on('unhandledRejection', console.log)