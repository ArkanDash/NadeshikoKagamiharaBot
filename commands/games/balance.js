import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const command = {
    name:"balance-game",
    description:"Check user money",
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
            .setDescription("New user?\nType `.profile` to register your account")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`You are sleeping!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        const embed = new MessageEmbed()
        .setDescription(`You have ${profileData.money} yen`)
        .setColor("#800080")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;