import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const command = {
    name:"delete-game",
    description:"Delete user",
    async execute(msg, client){
        let profileData;
        try{
            profileData = await userProfile.findOne({ userID: msg.author.id })
        }
        catch(e){
            
        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("What the...\nYou don't even register here.")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        const embed = new MessageEmbed()
        .setDescription("❌ Are you sure want to delete your account? ❌")
        .setColor("##FFFF00")
        let deleteMsg = msg.channel.send({embeds:[embed]})
        deleteMsg.react("✅")
        deleteMsg.react("❌")
    
        const filter = (reaction, user) => {
            return user.id == msg.author.id;
        }
    
        const collector = deleteMsg.createReactionCollector({
            filter,
            max: 1,
            time: 1000 * 15
        })
    
        collector.on('collect', (reaction) => {})
    
        collector.on('end', async (collected) => {
            if(collected.size == 0){
                const embed = new MessageEmbed()
                .setDescription("Time has run out to react.")
                .setColor("#FF0000")
                deleteMsg.edit({embeds:[embed]})
                return
            }
    
            let text = ""
            collected.forEach((message) =>{
                text = message.emoji.name
            })

            if(text == "✅"){
                const embed = new MessageEmbed()
                .setDescription("Deleting...")
                .setColor("#00FF00")
                deleteMsg.edit({embeds:[embed]})
                await userProfile.findByIdAndRemove({userID: msg.author.id})
            }
            else if(text == "❌"){
                const embed = new MessageEmbed()
                .setDescription("Canceled")
                .setColor("#FF0000")
                deleteMsg.edit({embeds:[embed]})
            }
        })

    }
}

export default command;