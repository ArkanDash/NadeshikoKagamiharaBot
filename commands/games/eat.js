import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

//Snacks
const deepFriedEgg = new Array("egg","friedsoftboiledegg", "deepfriedegg")
const cookie = new Array("cookie")
const smore = new Array("smore")
const shimarinDango = new Array("dango","shimarin","shimarindango")
const mochi = new Array("mochi", "moci")

//Foods
const mieKari = new Array("noodle", "curry", "currynoodle")
const beefborscht = new Array("beefborscht","beetborscht", "borscht")
const supPasta = new Array("soup", "pasta", "souppasta")
const sateDagingBabi = new Array("yakiton", "satay", "pig", "meat")
const hotpot = new Array("hotpot", "gyoza", "gyozanabe")
const sukiyaki = new Array("sukiyaki")

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

        if(!makanan){
            const embed = new MessageEmbed()
            .setTitle("List of Food")
            .addFields(
                {
                    name:'Snack', value: "Fried Soft-Boiled Egg = ⚡ 10\n`id:egg`\n\nCookie = ⚡ 5\n`id:cookie`\n\nSmore = ⚡ 10\n`id:smore`\n\nShimarin Dango = ⚡ 25\n`id:dango`\n\nMochi = ⚡ 20\n`id:mochi`", inline:true
                },
                {
                    name:'Food', value: "Curry Noodle = ⚡ 25\n`id:curry`\n\nBeet and Beef Borscht = ⚡ 40\n`id:borscht`\n\nSoup Style Pasta = ⚡ 50\n`id:soup`\n\nYakiton = ⚡ 30\n`id:yakiton`\n\nGyoza Nabe = ⚡ 75\n`id:hotpot`\n\nSukiyaki = ⚡ 90\n`id:sukiyaki`", inline:true
                }
            )
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let foodName = makanan.toLowerCase()
        let totalFood = parseInt(jumlahMakanan) || 1;

        //Snacks
        if(deepFriedEgg.includes(foodName)){
            itemSell(msg, "friedSoftBoiledEgg", totalFood, profileData)
        }
        else if(cookie.includes(foodName)){
            itemSell(msg, "cookie", totalFood, profileData)
        }
        else if(smore.includes(foodName)){
            itemSell(msg, "smore", totalFood, profileData)
        }
        else if(shimarinDango.includes(foodName)){
            itemSell(msg, "shimarinDango", totalFood, profileData)
        }
        else if(mochi.includes(foodName)){
            itemSell(msg, "mochi", totalFood, profileData)
        }
        //Foods
        else if(mieKari.includes(foodName)){
            itemSell(msg, "curryNoodle", totalFood, profileData)
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
        else if(sukiyaki.includes(foodName)){
            itemSell(msg, "sukiyaki", totalFood, profileData)
        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`Sorry, the food is not available`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

async function itemSell(msg, food, totalFood, profileData){
    let makanan;
    let stamina;
    //Snacks
    if(food == "friedSoftBoiledEgg"){
        stamina = 10
        makanan = "Fried Soft Boiled Egg"
    }
    else if(food == "cookie"){
        stamina = 5
        makanan = "Cookie"
    }
    else if(food == "smore"){
        stamina = 10
        makanan = "Smore"
    }
    else if(food == "shimarinDango"){
        stamina = 25
        makanan = "Shimarin Dango"
    }
    else if(food == "mochi"){
        stamina = 20
        makanan = "Mochi"
    }
    //Foods
    else if(food == "curryNoodle"){
        stamina = 25
        makanan = "Curry Noodle"
    }
    else if(food == "borscht"){
        stamina = 40
        makanan = "Borscht"
    }
    else if(food == "soupPasta"){
        stamina = 50
        makanan = "Soup Pasta"
    }
    else if(food == "yakiton"){
        stamina = 30
        makanan = "Yakiton"
    }
    else if(food == "gyozaNabe"){
        stamina = 75
        makanan = "Gyoza Nabe"
    }
    else if(food == "sukiyaki"){
        stamina = 90
        makanan = "Sukiyaki"
    }
    const totalStamina = stamina * totalFood
    const embed = new MessageEmbed()
    .setDescription(`Do you want to eat ${totalFood} ${makanan}?\n⚡ +${totalStamina}`)
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
            .setDescription("Time has run out to react.")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
            return
        }

        let text = ""
        collected.forEach((message) =>{
            text = message.emoji.name
        })
        

        if(text == "✅"){
            //Snacks
            let fsbe = profileData.foods.friedSoftBoiledEgg || 0
            let kue = profileData.foods.cookie || 0
            let smarsh = profileData.foods.smore || 0
            let dango = profileData.foods.shimarinDango || 0
            let moci = profileData.foods.mochi || 0
            //Foods
            let cryNod = profileData.foods.curryNoodles || 0
            let borscht = profileData.foods.beetAndBeefBorscht || 0
            let soupPasta = profileData.foods.soupPasta || 0
            let ykton = profileData.foods.yakiton || 0
            let gyoza = profileData.foods.gyozaNabe || 0
            let suki = profileData.foods.sukiyaki || 0

            let oldHunger = profileData.hunger
            //Snacks
            if(makanan == "Fried Soft Boiled Egg" && fsbe >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe - totalFood,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Cookie" && kue >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue - totalFood,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Smore" && smarsh >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh - totalFood,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Shimarin Dango" && dango >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango - totalFood,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Mochi" && moci >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci - totalFood,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            //Foods
            else if(makanan == "Curry Noodle" && cryNod >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod - totalFood,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Borscht" && borscht >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht - totalFood,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Soup Pasta" && soupPasta >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta - totalFood,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Yakiton" && ykton >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton - totalFood,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Gyoza Nabe" && gyoza >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza - totalFood,
                        "sukiyaki": suki
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else if(makanan == "Sukiyaki" && suki >= totalFood){
                let newHunger = oldHunger + totalStamina;
                if(newHunger >= 100){
                    newHunger = 100
                }
                const object = {
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki - totalFood
                    },
                    hunger: newHunger
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalStamina, makanan, totalFood)
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("You don't have this food.")
                .setColor("#FF0000")
                sellMsg.edit({embeds:[embed]})
                return
            }
            
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Canceled")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}

async function sendMessage(sellMsg, stamina, makanan, totalFood){

    const embed = new MessageEmbed()
    .setDescription(`You eat ${totalFood} ${makanan}\n⚡ +${stamina}`)
    .setColor("#00FF00")
    sellMsg.edit({embeds:[embed]})
}