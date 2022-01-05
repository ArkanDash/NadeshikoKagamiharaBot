import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"daily-game",
    description:"Daily rewards",
    async execute(msg, client){
        let profileData;
        const id = msg.author.id
        try{
            profileData = await userProfile.findOne({ userID: id })
        }
        catch(e){
            
        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
        else{
            const then = new Date(profileData.dailyCooldown).getTime()
            const now = new Date().getTime()

            let timeout = 1000 * 60 * 60 * 24
            if(timeout - (now - then) > 0){
                let timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`Kamu sudah mengklaim hadiah hari ini!\nTunggu **${timeLeft.hours} jam ${timeLeft.minutes} menit** sebelum mengunakan command ini!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            else{
                await userProfile.findOneAndUpdate({userID:id},{dailyCooldown: new Date()})
                const embed = new MessageEmbed()
                .setDescription("**Kamu telah mengklaim hadiah harian kamu!**")
                .setColor("#00FF00")
                msg.channel.send({embeds:[embed]})
            }
            
        }
    }
}

export default command;