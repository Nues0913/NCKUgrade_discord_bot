import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('grade')
    .setDescription('國立成功大學學籍系統');

/*
const data = new SlashCommandBuilder()
    .setName('grade')
    .setDescription('國立成功大學學籍系統')
    .addSubcommandGroup(group =>
        group.setName('登入')
            .setDescription('選擇登入選項')
            .addSubcommand(subcommand =>
                subcommand.setName('帳號與密碼')
                    .setDescription('使用帳號密碼登入')
                    .addStringOption(option =>
                        option.setName('account')
                            .setDescription('請輸入:學號@ncku.edu.tw')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('password')
                            .setDescription('請輸入密碼')
                            .setRequired(true)
            ))
            .addSubcommand(subcommand =>
                subcommand.setName('cookie')
                    .setDescription('使用cookie登入')
                    .addStringOption(option =>
                        option.setName('cookie')
                            .setDescription('請輸入有效cookie字串')
                            .setRequired(true)
            ))
    )
*/

async function execute(interaction) {
    const view = 
    await interaction.reply({ content: 'This command is under construction.', flags: "Ephemeral" });
    // await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
}

export { data, execute };