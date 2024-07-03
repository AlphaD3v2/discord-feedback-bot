const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("./config.json");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const rest = new REST({ version: "10" }).setToken(config.token);

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Sadek`);
  console.log(`https://discord.gg/free-accs`);

  rest.put(Routes.applicationCommands(client.user.id), {
    body: [new SlashCommandBuilder().setName("review").setDescription("review")],
  }).catch(error => {
    console.error('Failed to register bot commands:', error.code);
  });
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isCommand()) {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("1_star")
          .setLabel("⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("2_star")
          .setLabel("⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("3_star")
          .setLabel("⭐⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("4_star")
          .setLabel("⭐⭐⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("5_star")
          .setLabel("⭐⭐⭐⭐⭐")
          .setStyle("PRIMARY")
      );

      const embed = new MessageEmbed()
        .setTitle('Review Panel')
        .setColor('#05131f')
        .setDescription("Hello! Please take a moment to review our customer service.")
        .setThumbnail('https://media.discordapp.net/attachments/1138092372480233522/1188406137863811122/feedback.png?ex=659a6876&is=6587f376&hm=cb62c222bd87eaa85e7ec43d88c5d09b0f85719676d3eab2fe1f238f0104269e&=&format=webp&quality=lossless&width=675&height=675')
        .addField('Note', 'Click on one of the star buttons below to rate the customer service')
        .setFooter(`${interaction.guild ? interaction.guild.name : 'Unknown Server'}`)
        .setTimestamp();

      embed.addField('Please Rate:', '⭐⭐⭐⭐⭐', true);
      embed.addField('Rating Guide:', '⭐ - Terrible\n⭐⭐ - Bad\n⭐⭐⭐ - Average\n⭐⭐⭐⭐ - Good\n⭐⭐⭐⭐⭐ - Excellent', true);

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });

    } else if (interaction.isModalSubmit()) {
      const customId = interaction.customId;
      const stars = customId.split("_")[1];
      const channel = interaction.guild.channels.cache.get(config.channelId);
      const review = interaction.fields.getTextInputValue("review");
      const starText = "⭐".repeat(stars);
  
      const embed2 = new MessageEmbed()
        .setTitle('New Review Message')
        .setDescription(`**Review Message:**\n${review}\n\n`)
        .setColor('#020b12')
        .setThumbnail('https://media.discordapp.net/attachments/1138092372480233522/1188406137863811122/feedback.png?ex=659a6876&is=6587f376&hm=cb62c222bd87eaa85e7ec43d88c5d09b0f85719676d3eab2fe1f238f0104269e&=&format=webp&quality=lossless&width=675&height=675')
        .addField('Submitted By', interaction.user.toString(), true)
        .addField('Rating', starText || 'No rating available', true)
        .setTimestamp();
  
      await channel.send({
        embeds: [embed2]
      });
  
      const channelMention = channel.toString();
      const embed = new MessageEmbed()
        .setAuthor('✅ Done')
        .setColor('#020b12')
        .setDescription(`Review has been submitted to ${channelMention}`)
        .setTimestamp();
  
      interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
  
    } else if (interaction.isButton()) {
      const customId = interaction.customId;
      if (customId.endsWith("star")) {
        const stars = customId.split("_")[0];
        const review = new TextInputComponent()
          .setCustomId(`review`)
          .setLabel("Type your review message here")
          .setStyle("SHORT")
          .setRequired(true);
        const row = new MessageActionRow().addComponents(review);
        const modal = new Modal()
          .setCustomId(`stars_${stars}`)
          .setTitle("Type your review message here")
          .addComponents(row);
  
        await interaction.showModal(modal);
      }
    }
  } catch (error) {
    console.error('Interaction error:', error);
    handleError(interaction, error);
  }
});

client.login(config.token).catch(error => {
  console.error('Login error:', error);
});

function handleError(interaction, error) {
  let errorMessage = 'Error';
  if (error.code) {
    switch (error.code) {
      case 50001:
        errorMessage = 'Error code: 50001';
        break;
      case 50013:
        errorMessage = 'Error code: 50013';
        break;
      case 10003:
        errorMessage = 'Error code: 10003';
        break;
      case 10011:
        errorMessage = 'Error code: 10011';
        break;
      case 10008:
        errorMessage = 'Error code: 10008';
        break;
      case 30005:
        errorMessage = 'Error code: 30005';
        break;
      case 30013:
        errorMessage = 'Error code: 30013';
        break;
      case 30016:
        errorMessage = 'Error code: 30016';
        break;
      case 500:
        errorMessage = 'Error code: 500';
        break;
      case 40001:
        errorMessage = 'Error code: 40001';
        break;
      case 429:
        errorMessage = 'Error code: 429';
        break;
      default:
        errorMessage = `Error code: ${error.code}, please visit discord.gg/wicks for assistance`;
        break;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  interaction.reply({ content: errorMessage, ephemeral: true }).catch(console.error);
}
