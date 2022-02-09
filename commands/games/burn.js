import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const pineconeItem = new Array("pinecone", "pc")
const stickItem = new Array("stick", "stik")
const woodItem = new Array("wood", "kayu")

const command = {
    name:"burn-game",
    description:"Burn item for campfire fuel",
    async execute(msg, item, jumlahitem, client){
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

        if(!item){
            const embed = new MessageEmbed()
            .setTitle("List of Fuels for Campfires")
            .addFields(
                {
                    name: 'Your Fuel',
                    value: `Pinecone x${profileData.items.pinecone}\nWooden Stick x${profileData.items.stick}\nWood Log x${profileData.items.wood}`
                }
            )
            .setDescription("List of Fuels that can be burned: \n\nPinecone = 🔥 +3\n`id:pinecone`\n\nStick = 🔥 +10\n`id:stick`\n\nWood = 🔥 +25\n`id:wood`")
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let itemName = item.toLowerCase()
        let totalItem = parseInt(jumlahitem) || 1;

        if(pineconeItem.includes(itemName)){
            itemSell(msg, "pinecone", totalItem)
        }
        else if(stickItem.includes(itemName)){
            itemSell(msg, "stick", totalItem)
        }
        else if(woodItem.includes(itemName)){
            itemSell(msg, "wood", totalItem)
        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`The fuel you want to burn is unavailable.`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
        }
    }
}

export default command;

async function itemSell(msg, item, totalItem){
    let profileData;
    try{
        profileData = await userProfile.findOne({ userID: msg.author.id })
    }
    catch(e){
        
    }
    let namaItem = item.charAt(0).toUpperCase() + item.slice(1);
    let campFireDuration;
    if(item == "pinecone"){
        campFireDuration = 3
    }
    else if(item == "stick"){
        campFireDuration = 10
    }
    else if(item == "wood"){
        campFireDuration = 35
    }
    const totalMoney = campFireDuration * totalItem
    const embed = new MessageEmbed()
    .setDescription(`Do you want to burn **${totalItem} ${namaItem}**?\n🔥 +${totalMoney}`)
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
            let yourPinecone = profileData.items.pinecone
            let yourStick = profileData.items.stick
            let yourWood = profileData.items.wood
            let oldCampFire = profileData.campFire
            if(item == "pinecone" && yourPinecone >= totalItem){
                let newCampFire = oldCampFire + totalMoney;
                if(newCampFire >= 100){
                    newCampFire = 100
                }
                const object = {
                    items: {
                        pinecone: yourPinecone - totalItem,
                        stick: yourStick,
                        wood: yourWood,
                    },
                    campFire: newCampFire
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalMoney, item, totalItem)
            }
            else if(item == "stick" && yourStick >= totalItem){
                let newCampFire = oldCampFire + totalMoney;
                if(newCampFire >= 100){
                    newCampFire = 100
                }
                const object = {
                    items: {
                        pinecone: yourPinecone,
                        stick: yourStick - totalItem,
                        wood: yourWood
                    },
                    campFire: newCampFire
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalMoney, item, totalItem)
            }
            else if(item == "wood" && yourWood >= totalItem){
                let newCampFire = oldCampFire + totalMoney;
                if(newCampFire >= 100){
                    newCampFire = 100
                }
                const object = {
                    items: {
                        pinecone: yourPinecone,
                        stick: yourStick,
                        wood: yourWood - totalItem,
                    },
                    campFire: newCampFire
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                sendMessage(sellMsg, totalMoney, item, totalItem)
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("You don't have this fuel!")
                .setColor("#FF0000")
                sellMsg.edit({embeds:[embed]})
                return
            }
            
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Fuel burning canceled.")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}

async function sendMessage(sellMsg, totalMoney, item, totalItem){

    const embed = new MessageEmbed()
    .setDescription(`You burn ${totalItem} ${item}.\n🔥 +${totalMoney}`)
    .setColor("#00FF00")
    sellMsg.edit({embeds:[embed]})
}