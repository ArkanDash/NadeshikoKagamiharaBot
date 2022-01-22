import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

//Snacks
const deepFriedEgg = new Array("egg","friedsoftboiledegg", "deepfriedegg")
const cookie = new Array("cookie", "kue")
const smore = new Array("smore")
const shimarinDango = new Array("dango","shimarin")
const mochi = new Array("mochi", "moci")

//Foods
const mieKari = new Array("noodle", "curry", "currynoodle", "miekari")
const beefborscht = new Array("beefborscht","beetborscht", "borscht")
const supPasta = new Array("sup", "soup", "suppasta", "souppasta")
const sateDagingBabi = new Array("yakiton","daging", "babi", "sate", "satay")
const hotpot = new Array("hotpot", "gyoza", "gyozanabe")
const sukiyaki = new Array("sukiyaki")

const command = {
    name:"buy-game",
    description:"Buy Food from shop",
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

        if(profileData.sleep){
            const embed = new MessageEmbed()
            .setDescription(`Kamu sedang tidur!`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }

        if(!item){
            const embed = new MessageEmbed()
            .setDescription("Ummm... kamu mau beli apa?\nList makanan: `.shop`")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let foodName = item.toLowerCase()
        let totalFood = parseInt(totalItem) || 1;

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
        else if(shimarinDango.includes(foodName)){
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
    //Snacks
    if(food == "friedSoftBoiledEgg"){
        harga = 150
        makanan = "Fried Soft Boiled Egg"
    }
    else if(food == "cookie"){
        harga = 100
        makanan = "Cookie"
    }
    else if(food == "smore"){
        harga = 150
        makanan = "Smore"
    }
    else if(food == "shimarinDango"){
        harga = 250
        makanan = "Shimarin Dango"
    }
    else if(food == "mochi"){
        harga = 200
        makanan = "Mochi"
    }
    //Foods
    else if(food == "curryNoodle"){
        harga = 300
        makanan = "Curry Noodle"
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
    else if(food == "sukiyaki"){
        harga = 3000
        makanan = "Sukiyaki"
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
            let yourMoney = profileData.money

            //Snacks
            if(makanan == "Fried Soft Boiled Egg" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe + totalFood,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Cookie" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue + totalFood,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "mochi": moci,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Smore" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh + totalFood,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Shimarin Dango" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango + totalFood,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }

            //Foods
            else if(makanan == "Curry Noodle" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod + totalFood,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Borscht" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht + totalFood,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Soup Pasta" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta + totalFood,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Yakiton" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton + totalFood,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Gyoza Nabe" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza + totalFood,
                        "sukiyaki": suki
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, makanan, totalFood, totalHarga)
            }
            else if(makanan == "Sukiyaki" && yourMoney >= totalHarga){
                const object = {
                    money: yourMoney - totalHarga,
                    foods: {
                        "friedSoftBoiledEgg": fsbe,
                        "cookie": kue,
                        "smore": smarsh,
                        "shimarinDango": dango,
                        "curryNoodles": cryNod,
                        "beetAndBeefBorscht": borscht,
                        "soupPasta": soupPasta,
                        "yakiton": ykton,
                        "gyozaNabe": gyoza,
                        "sukiyaki": suki + totalFood
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