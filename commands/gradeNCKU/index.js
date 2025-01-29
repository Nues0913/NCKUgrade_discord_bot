import { TextInputStyle, TextInputBuilder, ModalBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import AuthService from './crawler.js';

const data = new SlashCommandBuilder()
    .setName('grade')
    .setDescription('國立成功大學學籍系統');

const loginActionRow = new ActionRowBuilder()
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

const APEnterModalActionRow = new ModalBuilder()
    .setCustomId('grade')
    .setTitle('請輸入帳號密碼')
    .addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('account')
                    .setLabel('帳號')
                    .setPlaceholder('請輸入學號@ncku.edu.tw')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('password')
                    .setLabel('密碼')
                    .setPlaceholder('請輸入密碼')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ));

const cookieEnterModalActionRow = new ModalBuilder()
            .setCustomId('gradeCookieEnter')
            .setTitle('請輸入cookie')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('cookie')
                            .setLabel('Cookie')
                            .setPlaceholder('請輸入成績頁面cookie')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ));

const logoutActionRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('grade')
            .setLabel('登出')
            .setStyle('Danger')
    );

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
async function execute(interaction) {
    let response = await interaction.reply({
        content: '請選擇一個選項：',
        components: [loginActionRow],
        flags: "Ephemeral",
        withResponse: true, // necessary for response.message
        });
    // TODO: 刻UI，刻監聽器或元件互動
    try {
        response = await response.resource.message.awaitMessageComponent({ filter : i => i.customId === 'grade', time: 60_000 });
        if(response.customId === 'grade'){
            if(!['account','cookie'].includes(response.values[0])) throw new Error('confirmValueError');
            const modal = response.values[0] === 'account' ? APEnterModalActionRow : cookieEnterModalActionRow;
            // response = await response.showModal(modal, { withResponse: true, time: 60_000 });
            // await response.showModal(modal);

            // // grade crawling
            // const authService = new AuthService();
            // let gradeObj = null;
            // await authService.login(, )
            //     .then(async () => {
            //         gradeObj = await scraper.getGradeCur();
            //         console.dir(grade);
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //     });
            // await interaction.editReply({content: `${confirmation.values[0]}`, components: []});
        } else {
            throw new Error('confirmIdError');
        }
    } catch (error) {
        await interaction.editReply({content: '發生錯誤，請稍後再試', components: []});
        console.error(error);
    }

}

export { data, execute };