import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import ms from "parse-ms"

const command = {
    name:"work-game",
    description:"Work to get money",
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
        
        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`You are sleeping!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        else{
            const then = new Date(profileData.workCooldown).getTime() || new Date(2018, 11)
            const now = new Date().getTime()

            let timeout = 1000 * 60 * 60
            if(timeout - (now - then) > 0){
                let timeLeft = ms(timeout - (now - then))
                const embed = new MessageEmbed()
                .setDescription(`Please wait **${timeLeft.minutes} minute ${timeLeft.seconds} second** before using this command!`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            else{
                const embed = new MessageEmbed()
                let yourMoney = profileData.money
                let work = workWages(profileData.camp)
                let newMoney = yourMoney + work[0]
                const object = {
                    money: newMoney,
                    workCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({userID:id}, object, {new:true})
                
                embed.setDescription(`You work as ${work[1]}.\n+💴 ${work[0]}`)
                embed.setColor("#00FF00")
                msg.channel.send({embeds:[embed]})
            }
        }
    }
}

export default command;

function workWages(id){
    let wages;
    let job;
    if(id == 0){
        wages = rndInt(100, 500)
        job = "Small Shop Cashier"
    }
    else if(id == 1){
        wages = rndInt(500, 1500)
        job = "Supermarket Cashier"
    }
    else if(id == 2){
        wages = rndInt(3000, 5000)
        job = "Mail Sender"
    }
    else if(id == 3){
        wages = rndInt(5000, 10000)
        job = "Bookstore Manager"
    }
    else if(id == 4){
        wages = rndInt(10000, 15000)
        job = "Pengirim Paket"
    }
    else if(id == 5){
        wages = rndInt(20000, 30000)
        job = "Restaurant Waiter"
    }
    else if(id == 6){
        wages = rndInt(30000, 75000)
        job = "Business Manager"
    }
    return [wages, job]
}

function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}