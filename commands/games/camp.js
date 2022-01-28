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
        else{
            let yourCamp = profileData.camp
            if(yourCamp > 6){
                const embed = new MessageEmbed()
                .setDescription("You have already moved to the last campsite.")
                .setColor("#FF0000")
                rmsg.edit({embeds:[embed]})
                return
            }
            
            let newCamp = await upgradeCamp(yourCamp)
            const embed = new MessageEmbed()
            embed.setDescription(`🏕 Do you want to move your camp to ${newCamp[0]}?\n💴 **${newCamp[1]} yen**`)
            embed.setTitle("Move Camp")
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
                    .setDescription("Time has run out to react.")
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

                        let timeout = 1000 * 60 * 60 * 24 * 3
                        if(timeout - (now - then) > 0){
                            let timeLeft = ms(timeout - (now - then))
                            const embed = new MessageEmbed()
                            .setDescription(`**You are on cooldown!**\n**${timeLeft.hours} hour ${timeLeft.minutes} minute left**`)
                            .setColor("#FF0000")
                            msg.channel.send({embeds:[embed]})
                            return
                        }

                        if(yourMoney < newCamp[1]){
                            const embed = new MessageEmbed()
                            .setDescription("Your money is not enough to move camp!")
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
                            embed2.setDescription(`Your camp has now moved to ${newCamp[0]}`)
                            embed2.setColor("#00FF00")
                            rmsg.edit({embeds:[embed2]})
                        }
                    
                }
                else if(text == "❌"){
                    const embed = new MessageEmbed()
                    .setDescription("Canceled")
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
        newCamp = "Kōan Campsite"
        cost = 5000
        newId = 1
    }
    else if(id == 1){
        newCamp = "Fumotoppara Campsite"
        cost = 25000
        newId = 2
    }
    else if(id == 2){
        newCamp = "Takabocchi Highlands"
        cost = 75000
        newId = 3
    }
    else if(id == 3){
        newCamp = "Shibire Lake"
        cost = 250000
        newId = 4
    }
    else if(id == 4){
        newCamp = "Jukaino Bokujou"
        cost = 750000
        newId = 5
    }
    else if(id == 5){
        newCamp = "Lake Yamanaka"
        cost = 2500000
        newId = 6
    }
    const campUpgrade = [newCamp, cost, newId]
    return campUpgrade;
}