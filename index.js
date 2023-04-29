const {
  Client,
  Collection,
  GatewayIntentBits,
  ChannelType,
  TextInputStyle,
  ModalBuilder,
  TextInputBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});
const config = require("./config.json");
const fs = require("fs");
const commands = require("./commands/commands.js");
const { closeTicket } = require("./src/utils");

client.commands = new Collection();

client.on("ready", async () => {
  console.log("Bot ligado e pronto para utilizar!");
  await client.user.setActivity("Wise Evolution");
});

client.on("messageCreate", async (message) => {
  //IGNORA OS BOTS
  if (message.author.bot) return;

  //IGNORA AS MENSAGENS PRIVADAS
  if (message.channel.type === "dm") return;

  if (message.content[0] != config.prefix) {
    return;
  }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  commands(message, command, args);
});

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Suporte
const channelNumberFileSuporte = "./channelNumberSuporte.txt";
if (!fs.existsSync(channelNumberFileSuporte)) {
  fs.writeFileSync(channelNumberFileSuporte, "0");
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Reportar
const channelNumberFileReportar = "./channelNumberReportar.txt";
if (!fs.existsSync(channelNumberFileReportar)) {
  fs.writeFileSync(channelNumberFileReportar, "0");
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Denuncia
const channelNumberFileDenuncia = "./channelNumberDenuncia.txt";
if (!fs.existsSync(channelNumberFileDenuncia)) {
  fs.writeFileSync(channelNumberFileDenuncia, "0");
}

//CRIA A ORDEM E SETA EM 0 SE O ARQUIVO NÃO EXISTIR - Compra
const channelNumberFileCompra = "./channelNumberCompra.txt";
if (!fs.existsSync(channelNumberFileCompra)) {
  fs.writeFileSync(channelNumberFileCompra, "0");
}

const createEmbed = async (interaction, message) => {
  const embed = new EmbedBuilder()
    .setColor("#2b2d31")
    .setDescription(`Ticket aberto por <@${interaction.user.id}>`)
    .setFooter({
      text: "Atenciosamente, Wise Evolution ©️ Todos direitos reservados.",
      iconURL: null,
    })
    .addFields({
      name: "Assunto",
      value: `Este ticket foi aberto para ${message}.`,
      inline: false,
    });
  return embed;
};

const currentChannelNumberSuporte = parseInt(
  fs.readFileSync(channelNumberFileSuporte, "utf8")
);
const currentChannelNumberReportar = parseInt(
  fs.readFileSync(channelNumberFileReportar, "utf8")
);
const currentChannelNumberDenuncia = parseInt(
  fs.readFileSync(channelNumberFileDenuncia, "utf8")
);
const currentChannelNumberCompra = parseInt(
  fs.readFileSync(channelNumberFileCompra, "utf8")
);

const createTicket = async (
  ticketType,
  interaction,
  parentCategorie,
  embedType,
  channelNumberFileType,
  currentChannelNumberType
) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Poke")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("pokeButton"),
    new ButtonBuilder()
      .setLabel("Fechar")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("closeButton"),
    new ButtonBuilder()
      .setLabel("Membro +")
      .setStyle(ButtonStyle.Success)
      .setCustomId("addMemberButton"),
    new ButtonBuilder()
      .setLabel("Membro -")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("removeMemberButton"),
    new ButtonBuilder()
      .setLabel("Criar Call")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("createCallButton")
  );

  const message = "<@&1083235223912849510>";
  const guild = interaction.guild;
  const channelName = `TICKET-${ticketType}-${currentChannelNumberType}`;
  guild.channels
    .create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: parentCategorie,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: "227182315082612737",
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    })
    .then(async (channel) => {
      channel.send({
        content: message,
        embeds: [embedType],
        components: [row],
      });
      await interaction.reply({ content: "Aguarde um momento..." });
      await interaction.editReply({
        content: `Seu ticket foi criado, acesse aqui: <#${channel.id}>`,
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 2000);
      interaction.user.send(
        `Seu ticket foi criado, acesse aqui: <#${channel.id}>`
      );
      fs.writeFileSync(
        channelNumberFileType,
        `${currentChannelNumberType + 1}`
      );
    })
    .catch(console.error);
};

//RESPONDER AOS EVENTOS
client.on("interactionCreate", async (interaction) => {
  //CRIAÇÃO DE SUPORTE
  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "ticket-select"
  ) {
    const selected = interaction.values[0];

    switch (selected) {
      case "suporte": {
        const embed = await createEmbed(interaction, "suporte geral.");
        createTicket(
          "SUPORTE",
          interaction,
          "1091081468278734878",
          embed,
          channelNumberFileSuporte,
          currentChannelNumberSuporte
        );
        break;
      }

      case "reportar": {
        const embed = await createEmbed(
          interaction,
          "reportar algum erro encontrado no servidor."
        );
        createTicket(
          "REPORT",
          interaction,
          "1091081435122769930",
          embed,
          channelNumberFileReportar,
          currentChannelNumberReportar
        );
        break;
      }

      case "denuncia": {
        const embed = await createEmbed(
          interaction,
          "denúncias de diversos tipos."
        );
        createTicket(
          "DENUNCIA",
          interaction,
          "1091081406068826182",
          embed,
          channelNumberFileDenuncia,
          currentChannelNumberDenuncia
        );
        break;
      }

      case "compra": {
        const embed = await createEmbed(
          interaction,
          "aquisição de pacotes oferecidos pelo servidor."
        );
        createTicket(
          "COMPRA",
          interaction,
          "1091081377241378917",
          embed,
          channelNumberFileCompra,
          currentChannelNumberCompra
        );
        break;
      }
    }
  }

  //BOTOES DO TICKET
  if (interaction.isButton()) {
    const button = interaction.customId;
    const channel = interaction.channel;

    switch (button) {
      case "closeButton": {
        if (
          !channel.guild.members.cache
            .get(interaction.user.id)
            .roles.cache.has("1083235223912849510")
        ) {
          channel.permissionOverwrites.set([
            {
              id: channel.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: "1084835609706762270",
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ]);
        } else if (
          channel.guild.members.cache
            .get(interaction.user.id)
            .roles.cache.has("1083235223912849510")
        ) {
          closeTicket(interaction);
        }
      }

      case "pokeButton": {
        const members = await channel.members.filter((member) =>
          member.roles.cache.has("1082895973640060978")
        );

        await interaction.reply({
          content: "Aguarde um momento...",
          ephemeral: true,
        });
        members.forEach(async (member) => {
          member.send(
            `Esta é uma mensagem padrão enviada através do ticket por <@${interaction.user.id}> no Wise Evolution.`
          );
          await interaction.editReply({
            content: `Sua mensagem foi enviada :D`,
            ephemeral: true,
          });
        });
      }

      case "addMemberButton": {
        if (button === "addMemberButton") {
          const modal = new ModalBuilder()
            .setCustomId("addMemberModal")
            .setTitle("Adicionar um membro");

          const userInput = new TextInputBuilder()
            .setCustomId("selectedMember")
            .setLabel("Digite o ID do membro")
            .setPlaceholder("Ex: 123456789012345678")
            .setStyle(TextInputStyle.Short);

          const row = new ActionRowBuilder().addComponents(userInput);

          modal.addComponents(row);

          await interaction.showModal(modal);
        }
      }

      case "removeMemberButton": {
        if (button === "removeMemberButton") {
          const modal = new ModalBuilder()
            .setCustomId("removeMemberModal")
            .setTitle("Remover um membro");

          const userInput = new TextInputBuilder()
            .setCustomId("selectedMember")
            .setLabel("Digite o ID do membro")
            .setPlaceholder("Ex: 123456789012345678")
            .setStyle(TextInputStyle.Short);

          const row = new ActionRowBuilder().addComponents(userInput);

          modal.addComponents(row);

          await interaction.showModal(modal);
        }
      }

      case "createCallButton": {
        const guild = interaction.guild;
        if (button === "createCallButton") {
          const ticketMembers = await channel.members.filter((member) => member.roles.cache.has("1082895973640060978"));

          await guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildVoice,
            parent: channel.parentId,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: interaction.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
              },
              {
                id: "1083235223912849510",
                allow: [PermissionsBitField.Flags.ViewChannel],
              },
            ],
          })
            .then((channel) => {
              ticketMembers.forEach(async (member) => {
                channel.permissionOverwrites.edit(member.id, { ViewChannel: true });
              });
              interaction.reply({ content: `Canal de voz criado com sucesso!` })
            })
            .catch(() => {
              interaction.reply({ content: `Não foi possível criar o canal de voz.` })
            });
        }

      }
    }
  }

  if (interaction.isModalSubmit()) {
    const modal = interaction.customId;
    const channel = interaction.channel;

    switch (modal) {
      case "addMemberModal": {
        if (modal === "addMemberModal") {
          const selectedMember =
            interaction.fields.getTextInputValue("selectedMember");

          await interaction.guild.members
            .fetch(selectedMember)
            .then((member) => {
              channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true,
              });
              interaction.reply({
                content: `<@${member.user.id}> foi adicionado ao ticket com sucesso!`,
              });
            })
            .catch(() => {
              interaction.reply({
                content: "Membro não encontrado.",
              });
            });
        }
      }

      case "removeMemberModal": {
        if (modal === "removeMemberModal") {
          const selectedMember =
            interaction.fields.getTextInputValue("selectedMember");

          await interaction.guild.members
            .fetch(selectedMember)
            .then((member) => {
              channel.permissionOverwrites.edit(member.id, {
                ViewChannel: false,
              });
              interaction.reply({
                content: `<@${member.user.id}> foi removido ao ticket com sucesso!`,
              });
            })
            .catch(() => {
              interaction.reply({
                content: "Membro não encontrado.",
              });
            });
        }
      }
    }
  }
});

client.login(config.token);
