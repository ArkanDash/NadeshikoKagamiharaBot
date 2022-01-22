import { MessageEmbed } from 'discord.js'
import userProfile from '../../schema/profile-scheme.js';

const command = {
    name:"footer-game",
    description:"Set a custom footer on profile embed",
    async execute(int, footerText, imageLink, client){
        let profileData;
        try{
            profileData = await userProfile.findOne({ userID: int.user.id })
        }
        catch(e){
            
        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            int.reply({embeds:[embed]})
            return
        }

        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`Kamu sedang tidur!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        
        if(imageLink.indexOf("http://") == 0 || imageLink.indexOf("https://") == 0) {
            let userID = int.user.id
            let object = {
                footerText: footerText,
                footerLink: imageLink
            }
            await userProfile.findOneAndUpdate({ userID }, object ,{ new: true })
            const embed = new MessageEmbed()
            .setDescription("Berhasil di set!")
            .setColor("#00FF00")
            .setFooter({
                text: footerText,
                iconURL: imageLink
            })
            int.reply({embeds:[embed]})
        }
        else{
            let userID = int.user.id
            let object = {
                footerText: footerText
            }
            await userProfile.findOneAndUpdate({ userID }, object ,{ new: true })
            const embed = new MessageEmbed()
            .setDescription("Berhasil di set!")
            .setColor("#00FF00")
            .setFooter({
                text: footerText
            })
            int.reply({embeds:[embed]})
        }

    }
}

export default command;