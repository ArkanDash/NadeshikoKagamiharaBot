import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"collect-game",
    description:"Collect items",
    async execute(msg, client){
        let profileData;
        const id = msg.author.id
        try{
            profileData = await userProfile.findOne({ userID: id})
        }
        catch (e){

        }
        if(!profileData){
            const embed = new MessageEmbed()
            .setDescription("Pengguna baru?\nKetik `.profile` untuk mendaftarkan akun kamu")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
        else{
            const then = new Date(profileData.collectCooldown).getTime()
            const now = new Date().getTime()

            let timeout = 1000 * 60 * 5
            if(timeout - (now - then) > 0){
                let timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`Tunggu **${timeLeft.minutes} menit** sebelum menggunakan command ini!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            else{
                const embed = new MessageEmbed()
                let collection = collectCalculation(profileData.camps.yourCamp)
                let pc = profileData.items.pinecone  += collection[0]
                let woodStick = profileData.items.stick  += collection[1]
                let woodLog = profileData.items.wood += collection[2]
                const object = { items: {
                    pinecone: pc,
                    stick: woodStick,
                    wood: woodLog || 0
                },
                collectCooldown: new Date()}
                await userProfile.findOneAndUpdate({userID:id}, object, {new:true})
                
                if(collection[2] == 0){
                    embed.setDescription(`Kamu mengumpulkan:\n<:yc_pinecone:927725824881336350> x${collection[0]}\n<stick> ${collection[1]}x\n:wood: ${collection[2]}x`)
                }
                else{
                    embed.setDescription(`Kamu mengumpulkan:\n<:yc_pinecone:927725824881336350> x${collection[0]}\n<stick> ${collection[1]}x`)
                }
                embed.setColor("#00FF00")
                msg.channel.send({embeds:[embed]})
            }
        }
    }
}

export default command;

function upgradeCamp(money, id){
    let newID;
    let cost;
    if(money >= 2500 && id == 0){
        newID = 1
        cost = 2500
    }
    else if(money >= 10000 && id == 1){
        newID = 2
        cost = 10000
    }
    else if(money >= 30000 && id == 2){
        newID = 3
        cost = 30000
    }
    else if(money >= 75000 && id == 3){
        newID = 4
        cost = 75000
    }
    else if(money >= 125000 && id == 4){
        newID = 5
        cost = 125000
    }
    return [newID, cost]
}

function collectCalculation(id){
    let pineCone;
    let woodStick;
    let woodLog;
    if(id == 0){
        pineCone = Math.floor(Math.random() * 3) + 1
        woodStick = Math.floor(Math.random() * 1)  + 1
    }
    else if(id == 1){
        pineCone = Math.floor(Math.random() * 7) + 1
        woodStick = Math.floor(Math.random() * 4) + 1
        woodLog = Math.floor(Math.random() * 1) + 1
    }
    else if(id == 2){
        pineCone = Math.floor(Math.random() * 12)  + 1
        woodStick = Math.floor(Math.random() * 8) + 1
        woodLog = Math.floor(Math.random() * 4) + 1
    }
    else if(id == 3){
        pineCone = Math.floor(Math.random() * 24)  + 1
        woodStick = Math.floor(Math.random() * 13) + 1
        woodLog = Math.floor(Math.random() * 9) + 1
    }
    else if(id == 4){
        pineCone = Math.floor(Math.random() * 35)  + 1
        woodStick = Math.floor(Math.random() * 21) + 1
        woodLog = Math.floor(Math.random() * 17) + 1
    }
    else if(id == 5){
        pineCone = Math.floor(Math.random() * 70) + 1
        woodStick = Math.floor(Math.random() * 43) + 1
        woodLog = Math.floor(Math.random() * 25) + 1
    }
    return [pineCone, woodStick, woodLog]
}
