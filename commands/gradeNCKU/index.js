import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

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

const actionRow = new ActionRowBuilder()
.addComponents(
    new StringSelectMenuBuilder()
        .setCustomId('grade')
        .setPlaceholder('請選擇登入方式')
        .addOptions([
            {
                label: '帳號與密碼',
                value: 'account',
                description: '使用帳號密碼登入',
            },
            {
                label: 'Cookie',
                value: 'cookie',
                description: '使用Cookie登入',
            }
        ]));

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
async function execute(interaction) {
    const response = await interaction.reply({
        content: '請選擇一個選項：',
        components: [actionRow],
        flags: "Ephemeral",
        withResponse: true, // necessary for response.message
        });
    // TODO: 刻UI，刻監聽器或元件互動
    try {
        const filter = i => i.customId === 'grade';
        const confirmation = await response.resource.message.awaitMessageComponent({ filter, time: 60_000 });
        if(confirmation.customId === 'grade'){
            await interaction.editReply({content: `${confirmation.values[0]}`, components: []});
        } else {
            await interaction.editReply({content: '該互動未受回應', components: []});
        }
    } catch (error) {
        await interaction.editReply({content: '操作逾時', components: []});
    }

}

export { data, execute };