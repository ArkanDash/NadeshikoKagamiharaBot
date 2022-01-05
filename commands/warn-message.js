import { MessageEmbed } from 'discord.js'

const command = {
    name:"warn-user",
    description:"Warn user if user said bad words",
    async execute(msg, client){
        msg.delete()

        const embedError = new MessageEmbed()
        .setColor("#FF0000")
        .setDescription("Hey!, anda ngomong kotor!")
        let warningMsg = await msg.channel.send({embeds:[embedError]})
        setTimeout(() =>{
            warningMsg.delete()
        }, 2000)
    }
}

export default command;