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

        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`Kamu sedang tidur!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        else{
            let yourCamp = profileData.camp
            if(yourCamp > 5){
                const embed = new MessageEmbed()
                .setDescription("Kamu sudah pindah ke camp yang paling tinggi harganya.")
                .setColor("#FF0000")
                rmsg.edit({embeds:[embed]})
                return
            }
            
            let newCamp = await upgradeCamp(yourCamp)
            const embed = new MessageEmbed()
            embed.setDescription(`🏕 Apakah kamu ingin pindah kamping ke ${newCamp[0]}?\n💴 **${newCamp[1]} yen**`)
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
                    rmsg.edit({embeds:[embed]})
                    return
                }
                
                let text = ""
                collected.forEach((message) =>{
                    text = message.emoji.name
                })

                if(text == "✅"){
                        let yourMoney = profileData.money
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

                        if(yourMoney < newCamp[1]){
                            const embed = new MessageEmbed()
                            .setDescription("Uang kamu tidak cukup untuk pindah kamp!")
                            .setColor("#FF0000")
                            rmsg.edit({embeds:[embed]})
                        }
                        else{
                            const updateMoney = yourMoney - newCamp[1]
                            let updateCamp = {
                                money: updateMoney,
                                camp: newCamp[2],
                                campCooldown: new Date()
                            }
                            await userProfile.findOneAndUpdate({userID: id}, updateCamp, {new: true})
                        
                            const embed2 = new MessageEmbed()
                            embed2.setDescription(`Perkemahan kamu sekarang pindah di ${newCamp[0]}`)
                            embed2.setColor("#00FF00")
                            rmsg.edit({embeds:[embed2]})
                        }
                    
                }
                else if(text == "❌"){
                    const embed = new MessageEmbed()
                    .setDescription("Dibatalkan")
                    .setColor("#FF0000")
                    rmsg.edit({embeds:[embed]})
                }
            })
        }
    }
}

export default command;

async function upgradeCamp(id){
    let newCamp, cost, newId;
    if(id == 0){
        newCamp = "Perkemahan Kōan"
        cost = 5000
        newId = 1
    }
    else if(id == 1){
        newCamp = "Perkemahan Fumotoppara"
        cost = 25000
        newId = 2
    }
    else if(id == 2){
        newCamp = "Dataran Tinggi Takabocchi"
        cost = 50000
        newId = 3
    }
    else if(id == 3){
        newCamp = "Danau Shibire"
        cost = 250000
        newId = 4
    }
    else if(id == 4){
        newCamp = "Jukaino Bokujou"
        cost = 750000
        newId = 5
    }
    else if(id == 5){
        newCamp = "Gunung Fuji"
        cost = 1500000
        newId = 6
    }
    const campUpgrade = [newCamp, cost, newId]
    return campUpgrade;
}