import { EmbedBuilder } from 'discord.js';
import NCKUgradeObj from './NCKUgradeObj.js'

class GradeNCKUEmbedBuilder extends EmbedBuilder {
    /**
     * 
     * @param {NCKUgradeObj | undefined} grade 
     */
    constructor(grade) {
        super();
        this.setTitle("國立成功大學學籍系統")
            .setURL("https://qrys.ncku.edu.tw/ncku/qrys02.asp")
            .setColor("#00ff00")
            .setFooter({
                text: "Powered by NCKUgrade_dcBot",
            })
            .setTimestamp();
            if(grade !== undefined) {
                this.setGradeData(grade);
            } else {
                this.setDescription(`資料來源: 尚無資料`);
            }
    }

    /**
     * Adds all datas in the `grade` to to the fields.
     * 
     * The single `grade.subjects[index]` will be added to a single field.
     * 
     * If the provided `grade` does not contain all of these properties, an error will be thrown.
     * 
     * @param {NCKUgradeObj} grade 
     * 
     * @throws {Error} Throws an error if the grade parameter missing necessary properties.
     * 
     * @returns {GradeNCKUEmbedBuilder} The current instance (`this`).
     */
    setGradeData(grade) {
        // if(grade.subjects.length <= 0) {
        //     throw new Error("empty subjects");
        // }
        const fields = [];
        grade.subjects.forEach(subject => {
            if(!subject.name || !subject.type || !subject.score || !subject.credit || !subject.code){
                throw new Error("grade parameter error: missing nessary properties");
            }
            fields.push({
                name: subject.name,
                value: `> **分類**: ${subject.type}\n> **學分數**: ${subject.credit}\n> **分數**: ${subject.score}\n> **課程代碼**: ${subject.code}`,
                inline: true
            });
        });
        this.setFields(fields);
        this.setDescription(`資料來源: ${grade.title}`);
        return this;
    }
}

export default GradeNCKUEmbedBuilder;