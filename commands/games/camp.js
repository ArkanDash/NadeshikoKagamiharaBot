import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

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
                for(let i = 0; i < 7; i++){
                    if(profileData.camps.yourCamp == i){
                        embed.setDescription(`🏕 Apakah kamu ingin pindah kamping ke ${profileData.camps.allCamp[i+1]}?\n💴 **${profileData.camps.campCost[i]} yen**`)
                        break;
                    }
                }
                embed.setTitle("Pindah Perkemahan")
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
                                let yourMoney = profileData.money
                                let cost;
                                if(yourMoney >= 5000 && pId == 0){
                                    cost = 5000
                                }
                                else if(yourMoney >= 25000 && pId == 1){
                                    cost = 25000
                                }
                                else if(yourMoney >= 50000 && pId == 2){
                                    cost = 50000
                                }
                                else if(yourMoney >= 250000 && pId == 3){
                                    cost = 250000
                                }
                                else if(yourMoney >= 750000 && pId == 4){
                                    cost = 750000
                                }
                                else if(yourMoney >= 1500000 && pId == 5){
                                    cost = 1500000
                                }

                                const then = new Date(profileData.campCooldown).getTime()
                                const now = new Date().getTime()

                                let timeout = 1000 * 60 * 60 * 12
                                if(timeout - (now - then) > 0){
                                    let timeLeft = ms(timeout - (now - then))
                                    const embed = new MessageEmbed()
                                    .setDescription(`**Anda sedang dalam cooldown!**\n**${timeLeft.hours} jam ${timeLeft.minutes} menit**`)
                                    .setColor("#FF0000")
                                    msg.channel.send({embeds:[embed]})
                                    return
                                }

                                if(profileData.money < cost){
                                    const embed = new MessageEmbed()
                                    .setDescription("Uang kamu tidak cukup untuk pindah kamp!")
                                    .setColor("#FF0000")
                                    msg.channel.send({embeds:[embed]})
                                }
                                else{
                                    const updateMoney = yourMoney - cost
                                    console.log(updateCamp)
                                    let updateCamp = {
                                        money: updateMoney,
                                        camps:{
                                            yourCamp: pId + 1,
                                            allCamp: [
                                                "Danau Motosu",
                                                "Perkemahan Kōan",
                                                "Perkemahan Fumotoppara",
                                                "Dataran Tinggi Takabocchi",
                                                "Jukaino Bokujou",
                                                "Danau Shibire",
                                                "Gunung Fuji"
                                            ],
                                            campCost: [
                                                2500,
                                                10000,
                                                30000,
                                                75000,
                                                125000,
                                                300000
                                            ]
                                        },
                                        campCooldown: new Date()
                                    }
                                    await userProfile.findOneAndUpdate({userID: id}, updateCamp, {new: true})
                                
                                    const embed2 = new MessageEmbed()
                                    for(let i = 0; i < 7; i++){
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