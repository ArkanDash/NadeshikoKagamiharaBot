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
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            int.reply({embeds:[embed]})
            return
        }
        
        if(imageLink.indexOf("http://") == 0 || imageLink.indexOf("https://") == 0) {
            let userID = int.user.id
            let object = {
                bannerImage: imageLink
            }
            await userProfile.findOneAndUpdate({ userID }, object ,{ new: true })
            const embed = new MessageEmbed()
            .setDescription("Berhasil di set!")
            .setColor("#00FF00")
            .setImage(imageLink)
            int.reply({embeds:[embed]})
        }
        else{
            const embed = new MessageEmbed()
            .setDescription("Link gambar tidak dapat diambil. Coba cek lagi.")
            .setColor("#FF0000")
            int.reply({embeds:[embed]})
        }

    }
}

export default command;