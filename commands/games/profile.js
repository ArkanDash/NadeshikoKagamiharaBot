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
                camps: JSON.parse(await readFile("./json/camp.json")),
                foods: JSON.parse(await readFile("./json/food.json")),
                items: JSON.parse(await readFile("./json/items.json"))   
            })
            profileData.save()

            const embed = new MessageEmbed()
            .setDescription("Akun kamu telah dibuat!")
            .setColor("#00FF00")
            const embed2 = new MessageEmbed()

            for(let i = 0; i < 7; i++){
                if(i == profileData.camps.yourCamp){
                    embed2.setDescription(`Perkemahan kamu berada di ${profileData.camps.allCamp[i]}`)
                    break;
                }
            }
            embed2.setTitle(`${msg.author.username}#${msg.author.discriminator} Profile`)
            embed2.setThumbnail(msg.author.displayAvatarURL())
            embed2.setColor("#800080")
            embed2.addFields(
                { 
                    name: 'Total Uang', value: `💴 ${profileData.money} yen`, inline: true
                },
                {
                    name: 'Stok Makanan', value: `Curry Noodle x${profileData.foods.curryNoodles}\nFried Soft-Boiled Egg x${profileData.foods.friedSoftBoiledEgg}\nBeet and Beef Borscht x${profileData.foods.beetAndBeefBorscht}\nSoup Style Pasta x${profileData.foods.soupPasta}\nYakiton x${profileData.foods.yakiton}\nGyoza Nabe x${profileData.foods.gyozaNabe}`
                },
                {
                    name: 'Items', value: `Pinecone x${profileData.items.pinecone}\nWooden Stick x${profileData.items.stick}\nWood Log x${profileData.items.wood}`
                },
                {
                    name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
                },
                {
                    name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
                }
            )
            embed2.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
            if(profileData.footer !== ""){
                embed2.setFooter(profileData.footer)
            }
            msg.channel.send({embeds:[embed, embed2]})
        }
        else{
            const embed = new MessageEmbed()
            for(let i = 0; i < 7; i++){
                if(i == profileData.camps.yourCamp){
                    embed.setDescription(`Perkemahan kamu berada di ${profileData.camps.allCamp[i]}`)
                    break;
                }
            }
            embed.setTitle(`${msg.author.username}#${msg.author.discriminator} Profile`)
            embed.setThumbnail(msg.author.displayAvatarURL())
            embed.setColor("#800080")
            embed.addFields(
                { 
                    name: 'Total Uang', value: `💴 ${profileData.money} yen`, inline: true
                },
                {
                    name: 'Stok Makanan', value: `Curry Noodle x${profileData.foods.curryNoodles}\nFried Soft-Boiled Egg x${profileData.foods.friedSoftBoiledEgg}\nBeet and Beef Borscht x${profileData.foods.beetAndBeefBorscht}\nSoup Style Pasta x${profileData.foods.soupPasta}\nYakiton x${profileData.foods.yakiton}\nGyoza Nabe x${profileData.foods.gyozaNabe}` 
                },
                {
                    name: 'Items', value: `Pinecone x${profileData.items.pinecone}\nWooden Stick x${profileData.items.stick}\nWood Log x${profileData.items.wood}`
                },
                {
                    name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
                },
                {
                    name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
                }
            )
            embed.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
            if(profileData.footer !== ""){
                embed2.setFooter(profileData.footer)
            }
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;