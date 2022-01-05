import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const command = {
    name:"camp-game",
    description:"Move/Upgrade camp location",
    async execute(msg, client){
        let profileData;
        const id = msg.author.id
        try{
            profileData = await userProfile.findOne({ userID: id })
        }
        catch(e){
            console.log(e)
        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
        else{
            if(profileData.camps.yourCamp < 5){
                const embed = new MessageEmbed()
                for(let i = 0; i < 6; i++){
                    if(profileData.camps.yourCamp == i){
                        embed.setDescription(`🏕 Apakah kamu ingin pindah kamping ke ${profileData.camps.allCamp[i+1]}?\n💴 **${profileData.camps.campCost[i]} yen**`)
                        break;
                    }
                }
                embed.setColor("#FFFF00")
                let rmsg = await msg.channel.send({embeds:[embed]})
                await rmsg.react("✅")
                await rmsg.react("❌")

                const filter = (reaction, user) => { return user.id === id }
                const collector = rmsg.createReactionCollector({ filter, max: 1, time: 1000 * 15 })
                collector.on('collect', (reaction) => {})

                collector.on('end', async (collected) => {
                    if(collected.size == 0){
                        const embed = new MessageEmbed()
                        .setDescription("Waktu reaksi habis.")
                        .setColor("#FF0000")
                        msg.channel.send({embeds:[embed]})
                        return
                    }
                    
                    let text = ""
                    collected.forEach((message) =>{
                        text = message.emoji.name
                    })
                        if(text == "✅"){
                            if(profileData.camps.yourCamp < 6){
                                let pId = profileData.camps.yourCamp
                                let money = profileData.money
                                let cost;
                                if(money >= 2500 && pId == 0){
                                    cost = 2500
                                }
                                else if(money >= 10000 && pId == 1){
                                    cost = 10000
                                }
                                else if(money >= 30000 && pId == 2){
                                    cost = 30000
                                }
                                else if(money >= 75000 && pId == 3){
                                    cost = 75000
                                }
                                else if(money >= 125000 && pId == 4){
                                    cost = 125000
                                }


                                if(profileData.money < cost){
                                    const embed = new MessageEmbed()
                                    .setDescription("Uang kamu tidak cukup untuk pindah kamp!")
                                    .setColor("#FF0000")
                                    msg.channel.send({embeds:[embed]})
                                }
                                else{
                                    let yourMoney = profileData.money - cost
                                    let updateCamp = {
                                        money: yourMoney,
                                        camps:{
                                            yourCamp: pId + 1,
                                            allCamp: [
                                                "Danau Motosu",
                                                "Perkemahan Kōan",
                                                "Perkemahan Fumotoppara",
                                                "Dataran Tinggi Takabocchi",
                                                "Jukaino Bokujou",
                                                "Gunung Fuji"
                                            ],
                                            campCost: [
                                                2500,
                                                10000,
                                                30000,
                                                75000,
                                                125000
                                            ]
                                        }
                                    }
                                    await userProfile.findOneAndUpdate({userID: id}, updateCamp, {new: true})
                                
                                    const embed2 = new MessageEmbed()
                                    for(let i = 0; i < 6; i++){
                                        if(profileData.camps.yourCamp == i){
                                            embed2.setDescription(`Perkemahan kamu sekarang pindah di ${profileData.camps.allCamp[i+1]}`)
                                            break;
                                        }
                                    }
                                    embed2.setColor("#00FF00")
                                    msg.channel.send({embeds:[embed2]})
                                }
                            }
                            else{
                                const embed = new MessageEmbed()
                                .setDescription("Kamu sudah pindah ke camp yang paling tinggi harganya.")
                                .setColor("#FF0000")
                                msg.channel.send({embeds:[embed]})
                            }
                            
                        }
                        else if(text == "❌"){
                            const embed = new MessageEmbed()
                            .setDescription("Dibatalkan")
                            .setColor("#FF0000")
                            msg.channel.send({embeds:[embed]})
                        }
                })
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("Kamu sudah pindah ke camp yang paling tinggi harganya.")
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
        }
    }
}

export default command;