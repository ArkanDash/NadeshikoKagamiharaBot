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
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`Kamu sedang tidur!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        const embed = new MessageEmbed()
        .setDescription(`Total uang kamu ${profileData.money} yen`)
        .setColor("#800080")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;