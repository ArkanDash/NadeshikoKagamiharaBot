import { MessageEmbed } from 'discord.js'
import fs from "fs/promises"

const command = {
    name:"send-embed",
    description:"Send-Embed",
    async execute(msg, client){
        const embed = new MessageEmbed()
        .setTitle("『 __Welcome__ 』")
        .setDescription("Selamat Datang di LHNTRX Camp.")
        .setColor("#800080");

        const embed2 = new MessageEmbed()
        .setImage("https://media.discordapp.net/attachments/888405126157594625/926984869597290527/20220102_064643.png")
        .setColor("#5100FF");

        const embed3 = new MessageEmbed()
        //.setTitle("『 __Rules__ 』")
        .setDescription("➪ Gaboleh sara\n➪ Gaboleh rasis\n➪ Share Sesuatu pada tempatnya\n➪ Jangan ribut\n➪ Gapapa toxic, yang penting tidak menimbulkan keributan\n➪ Tidak boleh melakukan hal-hal yang cabul diserver ini.\n➪ Jangan kirim informasi pribadi anda disini.")
        .setColor("#ADD8E6")

        msg.channel.send({embeds:[embed, embed2, embed3]})
    }
}

export default command;