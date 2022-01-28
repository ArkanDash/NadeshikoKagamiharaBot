import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"wake-game",
    description:"Wake from sleep",
    async execute(msg, client){
        let profileData;
        try{
            profileData = await userProfile.findOne({ userID: msg.author.id })
        }
        catch(e){
            
        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("New user?\nType `.profile` to register your account")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        if(profileData.sleep){
            const then = new Date(profileData.wakeCooldown).getTime()
            const now = new Date().getTime()

            const timeout = 1000 * 60 * 60 * 3

            if(timeout - (now - then) > 0){
                const timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`Please wait **${timeLeft.hours} hour ${timeLeft.minutes} minute** before waking up from sleep!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
            else{
                let object = {
                    sleep: false,
                    sleepCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({ userID: msg.author.id }, object, { new: true })
                const embed = new MessageEmbed()
                .setDescription(`You are now awake.`)
                .setColor("#00FF00")
                msg.channel.send({embeds:[embed]})
            }

        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`You have already awake!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;