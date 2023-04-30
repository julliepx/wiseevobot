//EMBEDS
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { closeTicket, backup } = require('../src/utils.js');
const roles = require('../src/roles.js');
const permissions = require('../src/permissions.js');
const { ROLES } = roles;
const { ALLOW } = permissions;

const utils = require('../src/utils.js');
const fs = require('fs');

const checkIsNaN = num => {
    num = parseInt(num)

    if (isNaN(num))
        console.log(`\`${num}\` não é um numero válido`)

    return num
}

/* const getUserProps = async id => {
    const [user] = await utils.query(`SELECT * FROM characters_props WHERE character_id = ?`, [id])
    if (!user)
        console.log(`Não encontramos o ID: \`${id}\`.`)

    return user
} */

const getUserById = async id => {
    const [user] = await utils.query(`SELECT * FROM vrp_users WHERE id = ?`, [id])
    if (!user)
        console.log(`Não encontramos o ID: \`${id}\`.`)

    return user
}

const getUserInfosById = async id => {
    const [userInfos] = await utils.query(`SELECT * FROM vrp_infos WHERE user_id = ?`, [id])
    if (!userInfos)
        console.log(`Não encontramos o ID: \`${id}\`.`)

    return userInfos
}

const getUserInfosByDiscord = async discord => {
    const [userInfos] = await utils.query(`SELECT * FROM vrp_infos WHERE discord = ?`, [discord])
    if (!userInfos)
        console.log(`Não encontramos o Discord: \`${discord}\`.`)

    return userInfos
}

const getUserByDiscord = async discord => {
    const [user] = await utils.query(`SELECT * FROM vrp_users WHERE discord = ?`, [discord])
    if (!user)
        console.log(`Não encontramos o Discord: \`${discord}\`.`)

    return user
}

const getUserVehicles = async (id) =>
    await utils.query(`SELECT * FROM vrp_vehicles WHERE user_id = ?`, [id])

/* const updateGarage = async (id, update) => {
    const { affectedRows } = await utils.query(`UPDATE characters_props SET garages_limit = ${update} WHERE character_id = ?`, [id])
    if (!affectedRows)
        console.log(`Não foi possível atualizar a garagem do jogador ${id}.`)
} */

const addVehicle = async ([id, ...vehicles]) => {
    for (let i = 0; i < vehicles.length; i++) {
        const { affectedRows } = await utils.query(`INSERT INTO vrp_vehicles SET vehicle = ?, user_id = ?`, [vehicles[i], id])
        if (!affectedRows)
            console.log(`Não foi possível adicionar o veículo.`)
    }

    /* await updateGarage(id, `garages_limit + ${vehicles.length}`) */
    return [id, vehicles]
}

const remVehicle = async ([id, ...vehicles]) => {
    for (let i = 0; i < vehicles.length; i++) {
        const { affectedRows } = await utils.query(`DELETE FROM vrp_vehicles WHERE user_id = ? AND vehicle = ? `, [id, vehicles[i]])
        if (!affectedRows)
            console.log(`O jogador não possui esse veículo. Ou não foi possível remover o veículo. (Verifique se o nome veículo está correto)`)
    }

    /* await updateGarage(id, `garages_limit - ${vehicles.length}`) */
    return [id, vehicles]
}

const checkVehicles = async ([id]) => {
    const results = await getUserVehicles(id)
    if (!results.length)
        console.log(`O jogador \`${id}\` não possui veículos.`)

    return [id, results.map(element => `${element.vehicle} | ${element.tax}`).join('\n')]
}

const allWithVehicle = async ([vehicle]) => {
    const results = await utils.query(`SELECT * FROM vrp_vehicles WHERE vehicle = ?`, [vehicle])
    if (!results.length)
        console.log(`Nenhum usuario possui o veiculo \`${vehicle}\`.`)

    return [vehicle, results.map(element => `${element.user_id} | ${element.engine}`).join('\n')]
}

const transferVehicle = async ([from, vehicle, to]) => {
    const quantveh = await getUserVehicles(to)
    /* const { garagem: vagas } = await getUserById(to)
    if (vagas <= quantveh.length)
        console.log(`O jogador \`${to}\` não tem vagas disponíveis para acomodar o veículo \`${vehicle}\``) */

    const veiculos = await utils.query(`SELECT * FROM vrp_vehicles WHERE vehicle = ? and user_id = ?`, [vehicle, from])
    if (!veiculos.length)
        console.log(`O jogador não possui esse veículo`)

    const { isVip, detido, financiado } = veiculos[0]
    if (isVip)
        console.log(`O veículo \`${vehicle}\` do jogador \`${from}\` é de **doação**`)

    if (detido)
        console.log(`O veículo \`${vehicle}\` do jogador \`${from}\` está **detido**`)

    if (financiado)
        console.log(`O veículo \`${vehicle}\` do jogador \`${from}\` está **financiado**`)

    const { affectedRows } = await utils.query(`UPDATE vrp_vehicles SET user_id = ? WHERE user_id = ? AND vehicle = ?`, [to, from, vehicle])
    if (!affectedRows)
        console.log('Houve um erro ao fazer a transferencia do veiculo')

    return [from, to, vehicle]
}

const setUserBanStatus = async (id, status, taxador) => {
    /* const { player } = await getUserById(id) */
    const { affectedRows } = await utils.query(`UPDATE characters SET banned = ? WHERE id = ?`, [status, id])
    if (!affectedRows)
        console.log('Usuário não encontrado')
}

const updateCharacterBank = async (id, symbol = '+', quantity = 1) => {
    checkIsNaN(quantity)
    const { affectedRows } = await utils.query(`UPDATE vrp_users SET bank = bank ${symbol} ${quantity} WHERE id = ?`, [id])
    if (!affectedRows)
        console.log('Houve um erro ao atualizar o banco do jogador')
}

module.exports.discord = async (message, [action, ...args]) => {
    switch (action) {
        case 'check': {
            const id = args[0];
            const [result] = await utils.query(`SELECT * FROM vrp_infos WHERE user_id = ?`, [id])

            if (!result){
                console.log(`Não encontramos o discord do ID: \`${id}\`.`)
            }

            return message.channel.send(result ? `O discord do ID \`${id}\` é: <@${result.discord}>` : `Não encontramos o discord do ID: \`${id}\`.`)
        }

        case 'alt': {
            const id = args[0];
            const discord = args[1];
            await utils.query(`UPDATE vrp_infos SET discord = ? WHERE user_id = ?`, [discord, id])

            if (!discord)
                console.log(`Não encontramos o discord do ID: \`${id}\`.`)

            return message.channel.send(`O discord do ID: \`${id}\` foi alterado para: <@${discord}>`)
        }
    }
}

module.exports.wl = async (message, [id] = []) => {
    const member = message.mentions.members.first();
    if (!member)
        console.log('Membro não encontrado.')

    const { affectedRows } = async () => {
        await utils.query(`UPDATE vrp_infos SET whitelist = 1 WHERE id = ?`, [id]);
        await utils.query(`UPDATE vrp_users SET discord = ? WHERE id = ?`, [member.id, id])
    }

    if (!affectedRows) {
        console.log(`${member} **primeiro** você deve tentar entrar na cidade!\nDepois você manda o seu ID novamente :D`)
    }

    /* await member.roles.add(ROLES.MORADOR);
    await member.roles.remove(ROLES.VIAJANTE);
    await member.roles.remove(ROLES.APROVADO); */


    member.send(`${member} Você está liberado para jogar em nosso servidor :D`)
    await message.channel.send(`${message.member} aprovou o ID: \`${id}\`.`)
}

module.exports.unwl = async (message, [id] = []) => {
    const user = await getUser(id);
    const member = await message.guild.members.fetch(user.discord);
    if (!id)
        console.log('Membro não encontrado.')

    const { affectedRows } = await utils.query(`UPDATE vrp_infos SET whitelist = 0 WHERE id = ?`, [id])

    if (!affectedRows) {
        member.send(`${member} Sua whitelist foi removida temporáriamente, caso não saiba o motivo, abra um TICKET em <#1086399220929531904>.`)
        console.log(`${member} **primeiro** você deve tentar entrar seguindo o tutorial!\nDepois você manda o seu ID novamente :D`)
    }

    /* await member.roles.remove(ROLES.MORADOR);
    await member.roles.add(ROLES.SUSPENSO); */

    member.send(`${member} Sua whitelist foi removida temporáriamente, caso não saiba o motivo, abra um TICKET em <#1086399220929531904>.`)
    await message.channel.send(`${message.member} removeu temporariamente a WL do ID: \`${id}\`.`)
}

module.exports.persona = async (message, [action, entryId]) => {
    switch (action) {
        case 'check': {
            if (entryId.length < 8) {
                const { name, name2 } = await getUserById(entryId);
                const { discord } = await getUserInfosById(entryId);
                return await message.channel.send(`${message.member} **checou** o personagem do jogador \`${entryId}\`:\nNome: \`${name} ${name2}\`\nDiscord: <@${discord}>`)
            } else {
                const { name, name2, id } = await getUserByDiscord(entryId);
                return await message.channel.send(`${message.member} **checou** o personagem do jogador <@${entryId}>:\nNome: \`${name} ${name2}\`\nID: \`${id}\``)
            }
        }
    }
}

module.exports.vehicle = async (message, [action, ...args]) => {
    switch (action) {
        case 'add': {
            try {
                const [id, vehicles] = await addVehicle(args);
                await message.channel.send(`${message.member} **adicionou** o(s) veículo(s) \`${vehicles.join(', ')}\` ao jogador \`${id}\`.`)
                return await message.channel.send(`${message.member} **adicionou** \`${vehicles.length}\` vagas na garagem para o jogador \`${id}\`.`)
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY')
                    return await message.channel.send(`${message.member} Este(s) veículo(s) já foram adicionados ao jogador.`)
            }
        }

        case 'rem': {
            try {
                const [id, vehicles] = await remVehicle(args);
                await message.channel.send(`${message.member} **removeu** o(s) veículo(s) \`${vehicles.join(', ')}\` do jogador \`${id}\`.`)
                return await message.channel.send(`${message.member} **removeu** \`${vehicles.length}\` vagas na garagem do jogador \`${id}\`.`)
            } catch (error) {
                return await message.channel.send(`O jogador não possui este(s) veículo(s). Ou não foi possível remover o veículo. (Verifique se o nome do veículo esta correto)`)
            }
        }

        case 'check': {
            const [id, vehicles] = await checkVehicles(args);
            return await message.channel.send(`O usuário \`${id}\` tem os seguintes veículos: \`\`\`${vehicles}\`\`\``)
        }

        case 'all': {
            const [vehicle, players] = await allWithVehicle(args)
            return await message.channel.send(`O veiculo \`${vehicle}\` tem os seguintes proprietarios: \`\`\`${players}\`\`\``)
        }

        case 'trans': {
            const [from, to, vehicle] = await transferVehicle(args)
            return await message.channel.send(`${message.member} **transferiu** o veículo \`${vehicle}\` do jogador \`${from}\` para o jogador \`${to}\`.`)
        }
    }
}

/* module.exports.ban = async (message, [id]) => {
    await setUserBanStatus(id, 1, message.member.id);
    await message.channel.send(`${message.member} **baniu** o ID \`${id}\`.`)
}

module.exports.unban = async (message, [id]) => {
    await setUserBanStatus(id, 0, message.member.id)
    await message.channel.send(`${message.member} desbaniu o ID \`${id}\`.`)
} */

module.exports.money = async (message, [action, id, quantity]) => {
    switch (action) {
        case 'check':
            {
                const { bank, paypal } = await getUserById(id)
                return await message.channel.send(`O jogador \`${id}\` tem: \`Banco: ${bank} | PayPal: ${paypal}\``)
            }

        case 'add':
            {
                try {
                    await updateCharacterBank(id, '+', parseInt(quantity))
                    return await message.channel.send(`${message.member} **adicionou** \`$${quantity}\` para o jogador \`${id}\`.`)
                } catch (error) {
                    if (error.code === 'ER_WARN_DATA_OUT_OF_RANGE')
                        return await message.channel.send(`Ta querendo deixar de ser pobre? K I R I D A. (o valor não pode ser alto demais)`)
                }
            }

        case 'rem':
            {
                await updateCharacterBank(id, '-', parseInt(quantity))
                return await message.channel.send(`${message.member} **removeu** \`$${quantity}\` do jogador \`${id}\`.`)
            }
    }
}

/* module.exports.garage = async (message, [action, id, quantity]) => {

    if (action != 'check')
        quantity = checkIsNaN(quantity)

    switch (action) {
        case 'check':
            {
                const { garages_limit } = await getUserProps(id)
                return await message.channel.send(`${message.member} o jogador \`${id}\` possuiu \`${garages_limit}\` vagas na garagem.`)
            }

        case 'add':
            {
                await updateGarage(id, `garages_limit + ${quantity}`)
                return await message.channel.send(`${message.member} **adicionou** \`${quantity}\` vagas na garagem para o jogador \`${id}\`.`)
            }

        case 'rem':
            {
                await updateGarage(id, `garages_limit - ${quantity}`)
                return await message.channel.send(`${message.member} **removeu** \`${quantity}\` vagas na garagem do jogador \`${id}\`.`)
            }

        case 'set':
            {
                await updateGarage(id, quantity)
                return await message.channel.send(`${message.member} **setou** \`${quantity}\` vagas na garagem para o jogador \`${id}\`.`)
            }
    }
} */

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

module.exports.createsuggestion = async (message) => {
    const embed = new EmbedBuilder()
        .setTitle('Wise Suporte')
        .setColor('#2b2d31')
        .setDescription('`📝` **Sugestões**\n・Deseja sugerir algo para o servidor? Digite sua sugestão detalhadamente abaixo.')
        .setAuthor({ name: 'Sugestões | Wise Evolution', iconURL: null })
        .setColor('#007FFF')
        .setFooter({ text: 'Wise Suporte' })
        .setImage('https://cdn.discordapp.com/attachments/792875068556312587/1091061318779404408/ticket.png');

    await message.delete();
    await message.channel.send({ embeds: [embed] });
}

module.exports.backupdb = async (message) => {
    backup(message);
    message.delete();
}

module.exports.close = async (message) => {
    closeTicket(message);
}