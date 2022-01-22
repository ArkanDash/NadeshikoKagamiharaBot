import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import { readFile } from "fs/promises"

const command = {
    name:"profile-game",
    description:"Profile Game",
    async execute(msg, client){
        let profileData;
        const id = msg.author.id
        try{
            profileData = await userProfile.findOne({ userID: msg.author.id })
        }
        catch(e){
            console.log(e)
        }
        
        if(!profileData){
            profileData = await userProfile.create({
                userID: id,
                money: 2500,
                foods: JSON.parse(await readFile("./json/food.json")),
                items: JSON.parse(await readFile("./json/items.json"))   
            })
            profileData.save()

            //Snacks
            let egg = profileData.foods.friedSoftBoiledEgg || 0
            let cookie = profileData.foods.cookie || 0
            let smore = profileData.foods.smore || 0
            let shimarindango = profileData.foods.shimarinDango || 0
            let mochi = profileData.foods.mochi || 0
            //Foods
            let currynoodle = profileData.foods.curryNoodles || 0
            let borscht = profileData.foods.beetAndBeefBorscht || 0
            let souppasta = profileData.foods.soupPasta || 0
            let yakiton = profileData.foods.yakiton || 0
            let gyozanabe = profileData.foods.gyozaNabe || 0
            let sukiyaki = profileData.foods.sukiyaki || 0

            const embed = new MessageEmbed()
            .setDescription("Akun kamu telah dibuat!")
            .setColor("#00FF00")
            const embed2 = new MessageEmbed()
            
            const yourCamp = await checkCamp(profileData.camp)
            embed2.setDescription(`Perkemahan kamu berada di ${yourCamp}`)
            embed2.setTitle(`${msg.author.username}#${msg.author.discriminator} Profile`)
            embed2.setThumbnail(msg.author.displayAvatarURL())
            embed2.setColor("#800080")
            embed2.addFields(
                { 
                    name: 'Total Uang', value: `💴 ${profileData.money} yen`
                },
                {
                    name: 'Snack', value: `Fried Soft-Boiled Egg x${egg}\nCookie x${cookie}\nSmore x${smore}\nShimarin Dango x${shimarindango}\nMochi x${mochi}`, inline:true
                },
                {
                    name: 'Makanan', value: `Curry Noodle x${currynoodle}\nBeet and Beef Borscht x${borscht}\nSoup Style Pasta x${souppasta}\nYakiton x${yakiton}\nGyoza Nabe x${gyozanabe}\nSukiyaki x${sukiyaki}`, inline:true
                },
                {
                    name: 'Items', value: `<:yc_pinecone:927725824881336350> Pinecone x${profileData.items.pinecone}\n<:yc_stick:933994005048479765> Wooden Stick x${profileData.items.stick}\n:wood: Wood Log x${profileData.items.wood}`
                },
                {
                    name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
                },
                {
                    name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
                }
            )
            if(profileData.footer !== ""){
                embed2.setFooter({
                    text:profileData.footerText,
                    iconURL:profileData.footerLink
                })
            }
            else{
                embed2.setFooter({
                    text:profileData.footerText
                })
            }

            if(profileData.bannerImage !== ""){
                embed2.setImage(profileData.bannerImage)
            }
            else{
                embed2.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
            }
            msg.channel.send({embeds:[embed, embed2]})
        }
        else{
            //Snacks
            let egg = profileData.foods.friedSoftBoiledEgg || 0
            let cookie = profileData.foods.cookie || 0
            let smore = profileData.foods.smore || 0
            let shimarindango = profileData.foods.shimarinDango || 0
            let mochi = profileData.foods.mochi || 0
            //Foods
            let currynoodle = profileData.foods.curryNoodles || 0
            let borscht = profileData.foods.beetAndBeefBorscht || 0
            let souppasta = profileData.foods.soupPasta || 0
            let yakiton = profileData.foods.yakiton || 0
            let gyozanabe = profileData.foods.gyozaNabe || 0
            let sukiyaki = profileData.foods.sukiyaki || 0

            const embed = new MessageEmbed()
            const yourCamp = await checkCamp(profileData.camp)
            embed.setDescription(`Perkemahan kamu berada di ${yourCamp}`)
            embed.setTitle(`${msg.author.username}#${msg.author.discriminator} Profile`)
            embed.setThumbnail(msg.author.displayAvatarURL())
            embed.setColor("#800080")
            embed.addFields(
                { 
                    name: 'Total Uang', value: `💴 ${profileData.money} yen`
                },
                {
                    name: 'Snack', value: `Fried Soft-Boiled Egg x${egg}\nCookie x${cookie}\nSmore x${smore}\nShimarin Dango x${shimarindango}\nMochi x${mochi}`, inline:true
                },
                {
                    name: 'Makanan', value: `Curry Noodle x${currynoodle}\nBeet and Beef Borscht x${borscht}\nSoup Style Pasta x${souppasta}\nYakiton x${yakiton}\nGyoza Nabe x${gyozanabe}\nSukiyaki x${sukiyaki}`, inline:true
                },
                {
                    name: 'Items', value: `<:yc_pinecone:927725824881336350> Pinecone x${profileData.items.pinecone}\n<:yc_stick:933994005048479765> Wooden Stick x${profileData.items.stick}\n:wood: Wood Log x${profileData.items.wood}`
                },
                {
                    name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
                },
                {
                    name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
                }
            )
            
            if(profileData.footer !== ""){
                embed.setFooter({
                    text:profileData.footerText,
                    iconURL:profileData.footerLink
                })
            }
            else{
                embed.setFooter({
                    text:profileData.footerText
                })
            }

            if(profileData.bannerImage !== ""){
                embed.setImage(profileData.bannerImage)
            }
            else{
                embed.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
            }
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

async function checkCamp(id){
    let yourCamp;
    if(id == 0){
        yourCamp = "Danau Motosu"
    }
    else if(id == 1){
        yourCamp = "Perkemahan Kōan"
    }
    else if(id == 2){
        yourCamp = "Perkemahan Fumotoppara"
    }
    else if(id == 3){
        yourCamp = "Dataran Tinggi Takabocchi"
    }
    else if(id == 4){
        yourCamp = "Danau Shibire"
    }
    else if(id == 5){
        yourCamp = "Jukaino Bokujou"
    }
    else if(id == 6){
        yourCamp = "Gunung Fuji"
    }
    return yourCamp;
}