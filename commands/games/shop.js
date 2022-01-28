import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const command = {
    name:"shop-game",
    description:"Game shop",
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
            const embed = new MessageEmbed()
            .setDescription(`You are sleeping!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        const embed = new MessageEmbed()
        .setTitle("Zebra Supermarket")
        .addFields(
            {
                name:'Snack', value: "Fried Soft-Boiled Egg = 💴 150\n`id:egg`\n\nCookie = 💴 100\n`id:cookie`\n\nSmore = 💴 150\n`id:smore`\n\nShimarin Dango = 💴 250\n`id:dango`\n\nMochi = 💴 200\n`id:mochi`", inline:true
            },
            {
                name:'Food', value: "Curry Noodle = 💴 300\n`id:curry`\n\nBeet and Beef Borscht = 💴 1300\n`id:borscht`\n\nSoup Style Pasta = 💴 1500\n`id:soup`\n\nYakiton = 💴 500\n`id:yakiton`\n\nGyoza Nabe = 💴 2500\n`id:hotpot`\n\nSukiyaki = 💴 3000\n`id:sukiyaki`", inline:true
            }
        )
        .setColor("#FF0000")
        msg.channel.send({embeds:[embed]})
        return
    }
}

export default command;