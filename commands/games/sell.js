import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"

const pineconeItem = new Array("pinecone", "pc")
const stickItem = new Array("stick", "stik")
const woodItem = new Array("wood", "kayu")

const command = {
    name:"sell-game",
    description:"Sell items",
    async execute(msg, item, jumlahItem, client){
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
            .setTitle("Selling Items")
            .setDescription("List of Item\n\nPinecone = 💴 15\n`id:pinecone`\n\nStick = 💴 50\n`id:stick`\n\nWood = 💴 125\n`id:wood`")
            .setColor("#800080")
            msg.channel.send({embeds:[embed]})
            return
        }
        let itemName = item.toLowerCase()
        let totalItem = parseInt(jumlahItem) || 1;

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
            .setDescription(`The item you want to sell doesn't exist.`)
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
    let itemToSell = item.charAt(0).toUpperCase() + item.slice(1);
    let price;
    if(item == "pinecone"){
        price = 15
    }
    else if(item == "stick"){
        price = 50
    }
    else if(item == "wood"){
        price = 125
    }
    let totalPrice = price * totalItem;
    const embed = new MessageEmbed()
    .setDescription(`Do you want to sell **${totalItem} ${itemToSell}** for **💴 ${totalPrice}** yen\nPrice per item = 💴 ${price}`)
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
            .setDescription("Sale canceled.")
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
            let yourMoney = profileData.money
            if(item == "pinecone" && yourPinecone >= totalItem){
                const object = {
                    money: yourMoney + totalPrice,
                    items: {
                        pinecone: yourPinecone - totalItem,
                        stick: yourStick,
                        wood: yourWood,
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})
                sendMessage(sellMsg, totalPrice)
            }
            else if(item == "stick" && yourStick >= totalItem){
                const object = {
                    money: yourMoney + totalPrice,
                    items: {
                        pinecone: yourPinecone,
                        stick: yourStick - totalItem,
                        wood: yourWood,
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})
                sendMessage(sellMsg, totalPrice)
            }
            else if(item == "wood" && yourWood >= totalItem){
                const object = {
                    money: yourMoney + totalPrice,
                    items: {
                        pinecone: yourPinecone,
                        stick: yourStick,
                        wood: yourWood - totalItem,
                    }
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})
                sendMessage(sellMsg, totalPrice)
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("The food you have is empty or lacking\n\nSale canceled.")
                .setColor("#FF0000")
                sellMsg.edit({embeds:[embed]})
                return
            }
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Sale canceled")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}

async function sendMessage(sellMsg, totalPrice){
    const embed = new MessageEmbed()
    .setDescription(`Item successfully sold!\n💴 +${totalPrice}`)
    .setColor("#00FF00")
    sellMsg.edit({embeds:[embed]})
}