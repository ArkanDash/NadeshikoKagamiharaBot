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

        const then = new Date(profileData.dailyCooldown).getTime() || new Date(2018, 11)
        const now = new Date().getTime()

        const timeout = 1000 * 60 * 60 * 24

        if(timeout - (now - then) > 0){
            const timeLeft = ms(timeout - (now - then))
            const embed = new MessageEmbed()
            .setDescription(`You've already claimed today's reward!\nPlease wait **${timeLeft.hours} hour ${timeLeft.minutes} minute** before using this command!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let yourCamp = profileData.camp
        let reward = dailyCalculation(profileData.camp)
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
        if(yourCamp > 0){
            embed.setDescription(`You have received:\n💴 +${reward[0]}\nPinecone ${reward[1]}x\nStick ${reward[2]}x\nWood Log ${reward[3]}x`)
        }
        else{
            embed.setDescription(`You have received:\n💴 +${reward[0]}\nPinecone ${reward[1]}x\nStick ${reward[2]}x`)
        }
        embed.setColor("#00FF00")
        msg.channel.send({embeds:[embed]})
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
    else if(id == 6){
        money = rndInt(25000, 50000)
        pineCone = rndInt(100, 300)
        woodStick = rndInt(75, 100)
        woodLog = rndInt(50, 100)
    }
    return [money ,pineCone, woodStick, woodLog]
}

function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}