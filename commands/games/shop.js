import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const mieKari = new Array("noodle", "curry", "currynoodle", "miekari")
const deepFriedEgg = new Array("egg","friedsoftboiledegg", "deepfriedegg")
const beefborscht = new Array("beefborscht","beetborscht", "borscht")
const supPasta = new Array("sup", "soup", "suppasta", "souppasta")
const sateDagingBabi = new Array("yakiton","daging", "babi", "sate", "satay")
const hotpot = new Array("hotpot", "gyoza", "gyozanabe")

const command = {
    name:"shop-game",
    description:"Game shop",
    async execute(msg, item, totalItem, client){
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

        if(!item){
            const embed = new MessageEmbed()
            .setTitle("Zebra Supermarket")
            .setDescription("List Makanan:\n\nCurry Noodle = 💴 300\n`id:curry`\n\nFried Soft-Boiled Egg = 💴 100\n`id:egg`\n\nBeet and Beef Borscht = 💴 1300\n`id:borscht`\n\nSoup Style Pasta = 💴 1500\n`id:soup`\n\nYakiton = 💴 500\n`id:yakiton`\n\nGyoza Nabe = 💴 2500\n`id:hotpot`\n\nPastikan nama makanan yang ingin kamu beli harus sama dengan id di list.")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let foodName = item.toLowerCase()
        let totalFood = parseInt(totalItem) || 1;

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
            .setDescription(`Maaf, barang tidak ada/tidak tersedia `)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

async function itemSell(msg, food, totalFood, profileData){
    let makanan;
    let harga;
    if(food == "curryNoodle"){
        harga = 300
        makanan = "Curry Noodle"
    }
    else if(food == "friedSoftBoiledEgg"){
        harga = 100
        makanan = "Fried Soft Boiled Egg"
    }
    else if(food == "borscht"){
        harga = 1300
        makanan = "Borscht"
    }
    else if(food == "soupPasta"){
        harga = 1500
        makanan = "Soup Pasta"
    }
    else if(food == "yakiton"){
        harga = 500
        makanan = "Yakiton"
    }
    else if(food == "gyozaNabe"){
        harga = 2500
        makanan = "Gyoza Nabe"
    }
    let totalHarga = harga * totalFood
    const embed = new MessageEmbed()
    .setDescription(`Apakah kamu yakin membeli **${totalFood} ${makanan}**?\ndengan seharga **💴 ${totalHarga}**`)
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
            let yourMoney = profileData.money
            if(makanan == "Curry Noodle" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod + totalFood,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Fried Soft Boiled Egg" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe + totalFood,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Borscht" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht + totalFood,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Soup Pasta" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta + totalFood,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Yakiton" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton + totalFood,
                        "gyozaNabe": gyoza
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Gyoza Nabe" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "curryNoodles": cryNod,
                        "friedSoftBoiledEgg": fsbe,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza + totalFood
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("Uang tidak cukup.")
                .setColor("#FF0000")
                sellMsg.edit({embeds:[embed]})
                return
            }
            
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Pembelian dibatalkan")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}

async function sendMessage(sellMsg, makanan, totalFood, totalPrice){

    const embed = new MessageEmbed()
    .setDescription(`Anda membeli ${totalFood} ${makanan}\n💴 -${totalPrice}`)
    .setColor("#00FF00")
    sellMsg.edit({embeds:[embed]})
}