import { MessageEmbed } from 'discord.js'

const command = {
    name:"help",
    description:"Help message",
    async execute(msg, client){
        const embed = new MessageEmbed()
        .setDescription("Belum ada untuk saat ini.")
        .setColor("#FFFF00")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;