import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"daily-game",
    description:"Daily rewards",
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
        }
        else{
            const then = new Date(profileData.dailyCooldown).getTime()
            const now = new Date().getTime()

            const timeout = 1000 * 60 * 60 * 24

            if(timeout - (now - then) > 0){
                const timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`Kamu sudah mengklaim hadiah hari ini!\nTunggu **${timeLeft.hours} jam ${timeLeft.minutes} menit** sebelum mengunakan command ini!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            let reward = dailyCalculation(profileData.camps.yourCamp)
            let money = profileData.money += reward[0]
            let pc = profileData.items.pinecone  += reward[1]
            let woodStick = profileData.items.stick  += reward[2]
            let woodLog = profileData.items.wood += reward[3]
            const object = { 
                money: money,
                items: {
                    pinecone: pc,
                    stick: woodStick,
                    wood: woodLog || 0
                },
                dailyCooldown: new Date()
            }
            await userProfile.findOneAndUpdate({userID:id}, object,{ new: true})
            const embed = new MessageEmbed()
            if(reward[3] == 0){
                embed.setDescription(`Kamu menerima hadiah berupa:\n💴 +${reward[0]}\n<:yc_pinecone:927725824881336350> x${reward[1]}\n<stick> ${reward[2]}x\n:wood: ${reward[3]}x`)
            }
            else{
                embed.setDescription(`Kamu menerima hadiah berupa:\n💴 +${reward[0]}\n<:yc_pinecone:927725824881336350> x${reward[1]}\n<stick> ${reward[2]}x`)
            }
            embed.setColor("#00FF00")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

function dailyCalculation(id){
    let money;
    let pineCone;
    let woodStick;
    let woodLog;
    if(id == 0){
        money = rndInt(100, 500)
        pineCone = rndInt(5, 15)
        woodStick = rndInt(2, 7)
    }
    else if(id == 1){
        money = rndInt(300, 1500)
        pineCone = rndInt(9, 23)
        woodStick = rndInt(5, 14)
        woodLog = rndInt(3, 8)
    }
    else if(id == 2){
        money = rndInt(1000, 3500)
        pineCone = rndInt(15, 33)
        woodStick = rndInt(11, 21)
        woodLog =  rndInt(9, 16)
    }
    else if(id == 3){
        money = rndInt(3000, 7500)
        pineCone = rndInt(25, 50)
        woodStick = rndInt(20, 34)
        woodLog = rndInt(15, 22)
    }
    else if(id == 4){
        money = rndInt(5000, 15000)
        pineCone = rndInt(35, 75)
        woodStick = rndInt(30, 45)
        woodLog = rndInt(23, 35)
    }
    else if(id == 5){
        money = rndInt(10000, 30000)
        pineCone = rndInt(61, 125)
        woodStick = rndInt(43, 76)
        woodLog = rndInt(36, 54)
    }
    return [money ,pineCone, woodStick, woodLog]
}

function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}