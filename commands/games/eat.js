import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const mieKari = new Array("noodle", "curry", "currynoodle", "miekari")
const deepFriedEgg = new Array("egg","friedsoftboiledegg", "deepfriedegg")
const beefborscht = new Array("beefborscht","beetborscht", "borscht")
const supPasta = new Array("sup", "soup", "suppasta", "souppasta")
const sateDagingBabi = new Array("yakiton","daging", "babi", "sate", "satay")
const hotpot = new Array("hotpot", "gyoza", "gyozanabe")

const command = {
    name:"eat-game",
    description:"Eat food",
    async execute(msg, makanan, jumlahMakanan, client){
        let profileData;
        try{
            profileData = await userProfile.findOne({ userID: msg.author.id })
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

        if(!makanan){
            const embed = new MessageEmbed()
            .setTitle("List Makanan")
            .setDescription("List Makanan yang kamu punya: \n\nCurry Noodle = ⚡ 15\n`id:curry`\n\nFried Soft-Boiled Egg = ⚡ 10\n`id:egg`\n\nBeet and Beef Borscht = ⚡ 50\n`id:borscht`\n\nSoup Style Pasta = ⚡ 75\n`id:soup`\n\nYakiton = ⚡ 25\n`id:yakiton`\n\nGyoza Nabe = ⚡ 90\n`id:hotpot`\n\nPastikan nama makanan yang kamu makan harus sama dengan id di list.")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let foodName = makanan.toLowerCase()
        let totalFood = parseInt(jumlahMakanan) || 1;

        if(mieKari.includes(foodName)){
            itemSell(msg, "curryNoodle", totalFood, profileData)
        }
        else if(deepFriedEgg.includes(foodName)){
            itemSell(msg, "friedSoftBoiledEgg", totalFood, profileData)
        }
        else if(beefborscht.includes(foodName)){
            itemSell(msg, "borscht", totalFood, profileData)
        }
        else if(supPasta.includes(foodName)){
            itemSell(msg, "soupPasta", totalFood, profileData)
        }
        else if(sateDagingBabi.includes(foodName)){
            itemSell(msg, "yakiton", totalFood, profileData)
        }
        else if(hotpot.includes(foodName)){
            itemSell(msg, "gyozaNabe", totalFood, profileData)
        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`Kamu mau makan apa? Batu? `)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

async function itemSell(msg, food, totalFood, profileData){
    let makanan;
    let stamina;
    if(food == "curryNoodle"){
        makanan = "Curry Noodle"
        stamina = 15
    }
    else if(food == "friedSoftBoiledEgg"){
        makanan = "Fried Soft Boiled Egg"
        stamina = 10
    }
    else if(food == "borscht"){
        makanan = "Borscht"
        stamina = 50
    }
    else if(food == "soupPasta"){
        makanan = "Soup Pasta"
        stamina = 75
    }
    else if(food == "yakiton"){
        makanan = "Yakiton"
        stamina = 25
    }
    else if(food == "gyozaNabe"){
        makanan = "Gyoza Nabe"
        stamina = 90
    }
    const embed = new MessageEmbed()
    .setDescription(`Apakah kamu ingin makan ${totalFood} ${makanan}?\n⚡ +${stamina}`)
    .setColor("#FF0000")
    let sellMsg = await msg.channel.send({embeds:[embed]})
    sellMsg.react("✅")
    sellMsg.react("❌")

    const filter = (reaction, user) => {
        return user.id == msg.author.id;
    }

    const collector = sellMsg.createReactionCollector({
        filter,
        max: 1,
        time: 1000 * 15
    })

    collector.on('collect', (reaction) => {})

    collector.on('end', async (collected) => {
        if(collected.size == 0){
            const embed = new MessageEmbed()
            .setDescription("Waktu reaksi habis!")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
            return
        }

        let text = ""
        collected.forEach((message) =>{
            text = message.emoji.name
        })
        

        if(text == "✅"){
            let cryNod = profileData.foods.curryNoodles
            let fsbe = profileData.foods.friedSoftBoiledEgg
            let borscht = profileData.foods.beetAndBeefBorscht
            let soupPasta = profileData.foods.soupPasta
            let ykton = profileData.foods.yakiton
            let gyoza = profileData.foods.gyozaNabe
            if(makanan == "Curry Noodle" && cryNod >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod - totalFood,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else if(makanan == "Fried Soft Boiled Egg" && fsbe >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe - totalFood,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else if(makanan == "Borscht" && borscht >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht - totalFood,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else if(makanan == "Soup Pasta" && soupPasta >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta - totalFood,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else if(makanan == "Yakiton" && ykton >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton - totalFood,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else if(makanan == "Gyoza Nabe" && gyoza >= totalFood){
                const object = {
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza - totalFood
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(msg, stamina, makanan, totalFood)
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("Makanan yang kamu punya kurang.")
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Kamu tidak jadi makan")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}

async function sendMessage(msg, stamina, makanan, totalFood){

    const embed = new MessageEmbed()
    .setDescription(`Anda memakan ${totalFood} ${makanan}\n⚡ +${stamina}`)
    .setColor("#FF0000")
    msg.channel.send({embeds:[embed]})
}