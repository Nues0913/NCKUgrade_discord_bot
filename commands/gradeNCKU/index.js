import { TextInputStyle, TextInputBuilder, ModalBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import AuthService from './crawler.js';
import { error, time } from 'console';

const data = new SlashCommandBuilder()
    .setName('grade')
    .setDescription('國立成功大學學籍系統');

const loginActionRow = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('gradeSelectMenu')
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

const APEnterModal = new ModalBuilder()
    .setCustomId('gradeAPEnter')
    .setTitle('請輸入帳號密碼')
    .addComponents(
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('accountEnter')
                    .setLabel('帳號')
                    .setPlaceholder('請輸入學號@ncku.edu.tw')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ),
        new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('passwordEnter')
                    .setLabel('密碼')
                    .setPlaceholder('請輸入密碼')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
            ));

const cookieEnterModal = new ModalBuilder()
            .setCustomId('gradeCookieEnter')
            .setTitle('請輸入cookie')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('cookieEnter')
                            .setLabel('Cookie')
                            .setPlaceholder('請輸入成績頁面cookie')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ));

// const logoutActionRow = new ActionRowBuilder()
//     .addComponents(
//         new ButtonBuilder()
//             .setCustomId('grade')
//             .setLabel('登出')
//             .setStyle('Danger')
//     );

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
        response = await response.resource.message.awaitMessageComponent({
            filter : i => i.customId === 'gradeSelectMenu',
            time: 60_000
        });
        if(response.customId === 'gradeSelectMenu'){
            if(!['account','cookie'].includes(response.values[0])) throw new Error('confirmValueError');
            const modal = response.values[0] === 'account' ? APEnterModal : cookieEnterModal;
            await response.showModal(modal);
            response.awaitModalSubmit({
                filter: i => ['gradeAPEnter', 'gradeCookieEnter'].includes(i.customId),
                time: 60_000
            })
                .then(async (modalInteraction) => {
                    let a, p;
                    if(modalInteraction.customId == 'gradeAPEnter'){
                        a = modalInteraction.fields.getTextInputValue('accountEnter');
                        p = modalInteraction.fields.getTextInputValue('passwordEnter');
                        await modalInteraction.deferUpdate();
                        await interaction.editReply({content: `${a}, ${p}`, components: []});
                    } else {
                        a = modalInteraction.fields.getTextInputValue('cookieEnter');
                        await modalInteraction.deferUpdate();
                        await interaction.editReply({content: `${a}`, components: []});
                    }
                    // console.log(a);
                    // console.log(p);
                    // interaction.editReply({content: `${a}, ${p}`, components: []});
                })
                .catch((error) => {
                    console.error(error);
                })

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