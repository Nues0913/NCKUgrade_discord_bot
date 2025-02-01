import { TextInputStyle, TextInputBuilder, ModalBuilder, ButtonBuilder, ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import GradeNCKUEmbedBuilder from './classes/GradeNCKUEmbedBuilder.js';
import AuthService from './classes/AuthService.js';
import { cloneDeep } from 'lodash-es';

const data = new SlashCommandBuilder()
    .setName('grade_ncku')
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
    try {
        const SelectMenuCollector = response.resource.message.createMessageComponentCollector({
            filter: i => i.customId === 'gradeSelectMenu' && i.user.id === interaction.user.id,
            time: 60_000
        });
        SelectMenuCollector.on('collect', async (menuInteraction) => {
            if (menuInteraction.customId !== 'gradeSelectMenu') return;
            if (!['account', 'cookie'].includes(menuInteraction.values[0])) return;
            try {
                const modal = menuInteraction.values[0] === 'account' ? cloneDeep(APEnterModal) : cloneDeep(cookieEnterModal);
                modal.setCustomId(modal.data.custom_id + Date.now().toString());
                await menuInteraction.showModal(modal);
                await menuInteraction.awaitModalSubmit({
                    filter: i => modal.data.custom_id === i.customId && i.user.id == menuInteraction.user.id && i.message.id === response.resource.message.id,
                    time: 60_000
                })
                    .then(async (modalInteraction) => {
                        let a, p;
                        if (modalInteraction.customId.includes('gradeAPEnter')) {
                            a = modalInteraction.fields.getTextInputValue('accountEnter');
                            p = modalInteraction.fields.getTextInputValue('passwordEnter');
                        } else {
                            a = modalInteraction.fields.getTextInputValue('cookieEnter');
                        }
    
                        const gradeAuth = new AuthService();
                        try {   // login successful
                            await gradeAuth.login(a, p);
                            const gradeEmbed = new GradeNCKUEmbedBuilder(await gradeAuth.getGradeCur());
                            if(!modalInteraction.deferred && !modalInteraction.replied) await modalInteraction.deferUpdate();
                            await menuInteraction.editReply({ content: '', embeds: [gradeEmbed], components: [] });
                            SelectMenuCollector.stop('successful');
                        } catch (error) {   // login failed
                            if(error.message === 'login failed'){
                                if(!modalInteraction.deferred && !modalInteraction.replied) await modalInteraction.deferUpdate();
                                await menuInteraction.editReply({ content: '登入失敗，請再試一次', embeds: [], components: [] });
                                SelectMenuCollector.stop('failed');
                            } else {
                                throw error;
                            }
                        }
                    })
                    .catch((error) => {
                        throw error;
                    });
            } catch (error) {
                if (error.name === "Error [InteractionCollectorError]" && interaction.replied && (await interaction.fetchReply()).content !== '連線逾時，請再試一次') {
                    console.log(`[grade_ncku] user ${interaction.user.username} modal 連線逾時: ${new Date().toString()}]`);
                    await interaction.editReply({ content: '連線逾時，請再試一次', components: [] });
                }else {
                    console.log(`[grade_ncku] error in SelectMenuCollector.on\n${new Date().toString()}] ❌ error occurred:`);
                    console.error(error);
                    console.log(`\n`);
                }
            }
        });
        SelectMenuCollector.on('end', async (collected, reason) => {
            if (reason === 'time' && interaction.replied && (await interaction.fetchReply()).content !== '連線逾時，請再試一次') {
                console.log(`[grade_ncku] user ${interaction.user.username} gradeSelectMenu 連線逾時: ${new Date().toString()}]`);
                await interaction.editReply({ content: '連線逾時，請再試一次', embeds: [], components: [] });
            } else {
                
            }
        });
    } catch (error) {
        console.log(`[grade_ncku] ❌ error occurred ${new Date().toString()}:`);
        console.error(error);
        console.log(`\n`);
        await interaction.editReply({ content: '發生錯誤，請稍後再試', components: [] });
    }

}

export { data, execute };