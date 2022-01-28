import { MessageEmbed } from 'discord.js'
import userProfile from '../../schema/profile-scheme.js';

const command = {
    name:"banner-game",
    description:"Set a custom banner on profile embed",
    async execute(int, imageLink, client){
        let profileData;
        try{
            profileData = await userProfile.findOne({ userID: int.user.id })
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
        
        if(/\.(jpg|gif|png)$/.test(imageLink)){
            let userID = int.user.id
            let object = {
                bannerImage: imageLink
            }
            await userProfile.findOneAndUpdate({ userID }, object ,{ new: true })
            const embed = new MessageEmbed()
            .setDescription("Successfully been set!")
            .setColor("#00FF00")
            .setImage(imageLink)
            int.reply({embeds:[embed]})
        }
        else{
            const embed = new MessageEmbed()
            .setDescription("Image link could not be retrieved. Please check again.")
            .setColor("#FF0000")
            int.reply({embeds:[embed]})
        }

    }
}

export default command;