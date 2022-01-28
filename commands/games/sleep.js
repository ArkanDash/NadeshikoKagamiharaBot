import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"sleep-game",
    description:"Sleeping to pause hunger and campfire",
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

        if(!profileData.sleep){
            const then = new Date(profileData.sleepCooldown).getTime()
            const now = new Date().getTime()

            const timeout = 1000 * 60 * 60 * 8

            if(timeout - (now - then) > 0){
                const timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`You must wait **${timeLeft.hours} hour ${timeLeft.minutes} minute** before sleeping!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
            else{
                let object = {
                    sleep: true,
                    wakeCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({ userID: msg.author.id }, object, { new: true })
                const embed = new MessageEmbed()
                .setDescription(`You are asleep now.`)
                .setColor("#00FF00")
                msg.channel.send({embeds:[embed]})
            }

        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`You have already sleeping!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;