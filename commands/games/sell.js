import { MessageEmbed } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
const itemID = new Array("pinecone", "stick", "wood")

const command = {
    name:"sell-game",
    description:"Sell items",
    async execute(msg, item, jumlahItem, client){  

        if(!item){
            const embed = new MessageEmbed()
            .setTitle("Jual Item")
            .setDescription(`List Item\n\nPinecone = 💴 15\nStick = 💴 50\nWood = 💴 125\n\nPastikan nama item yang kamu jual harus sama dengan yang di list.`)
            .setColor("#FF0000")
            msg.channel.send({embeds:[embed]})
            return
        }
        let itemName = item.toLowerCase()
        let totalItem = parseInt(jumlahItem) || 1;

        if(itemName == "pinecone"){
            itemSell(msg, itemName, totalItem)
        }
        else if(itemName == "stick"){
            itemSell(msg, itemName, totalItem)
        }
        else if(itemName == "wood"){
            itemSell(msg, itemName, totalItem)
        }
        else{
            const embed = new MessageEmbed()
            .setDescription(`Item yang ingin kamu jual tidak ada`)
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
    .setDescription(`Apakah kamu ingin menjual **${totalItem} ${itemToSell}**\ndengan seharga **💴 ${totalPrice}**\nHarga per item = 💴 ${price}`)
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
            .setDescription("Penjualan barang dibatalkan")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
            return
        }

        let text = ""
        collected.forEach((message) =>{
            text = message.emoji.name
        })
        

        if(text == "✅"){
            let yourPc = profileData.items.pinecone
            let yourWoodStick = profileData.items.stick
            let yourWoodLog = profileData.items.wood
            let yourMoney = profileData.money + totalPrice
            if(item == "pinecone" && yourPc >= totalItem){
                let pc = yourPc - totalItem
                let woodStick = yourWoodStick
                let woodLog = yourWoodLog
                const object = {
                    money: yourMoney,
                    items: {
                        pinecone: pc,
                        stick: woodStick,
                        wood: woodLog,
                    },
                    collectCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                const embed = new MessageEmbed()
                .setDescription(`Barang berhasil di jual!\n💴 +${totalPrice}`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
            else if(item == "stick" && yourWoodStick >= totalItem){
                let pc = yourPc
                let woodStick = yourWoodStick - totalItem
                let woodLog = yourWoodLog
                const object = {
                    money: yourMoney,
                    items: {
                        pinecone: pc,
                        stick: woodStick,
                        wood: woodLog,
                    },
                    collectCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                const embed = new MessageEmbed()
                .setDescription(`Barang berhasil di jual!\n💴 +${totalPrice}`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
            else if(item == "wood" && yourWoodLog >= totalItem){
                let pc = yourPc
                let woodStick = yourWoodStick
                let woodLog = yourWoodLog - totalItem
                const object = {
                    money: yourMoney,
                    items: {
                        pinecone: pc,
                        stick: woodStick,
                        wood: woodLog,
                    },
                    collectCooldown: new Date()
                }
                await userProfile.findOneAndUpdate({userID: msg.author.id}, object, {new: true})

                const embed = new MessageEmbed()
                .setDescription(`Barang berhasil di jual!\n💴 +${totalPrice}`)
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
            }
            else{
                const embed = new MessageEmbed()
                .setDescription("Item yang kamu punya kurang\n\nPenjualan barang dibatalkan.")
                .setColor("#FF0000")
                msg.channel.send({embeds:[embed]})
                return
            }
            
        }
        else if(text == "❌"){
            const embed = new MessageEmbed()
            .setDescription("Penjualan barang dibatalkan")
            .setColor("#FF0000")
            sellMsg.edit({embeds:[embed]})
        }
    })
}