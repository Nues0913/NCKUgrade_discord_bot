import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .addAttachmentOption(option => option
        .setName('attachment')
        .setDescription('Attachment to upload')
        .setRequired(true)
    )

async function execute(interaction) {
    await interaction.reply('p!');
}

export { data, execute };