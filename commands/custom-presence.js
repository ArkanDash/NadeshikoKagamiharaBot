import { MessageEmbed } from 'discord.js'
import { readFile, writeFile } from "fs/promises";

const command = {
    name:"custom-presence",
    description:"Custom Presence",
    async execute(msg, aktifitas, statusData, client){
        if(msg.user.id != "844617532517777409"){
            const embedError = new MessageEmbed()
            .setColor("#FF0000")
            .setDescription("Hey!, kamu bukan suami saya!")
            msg.reply({embeds:[embedError]});
        }
        else{
            if(aktifitas == undefined && statusData == undefined){
                const embedError = new MessageEmbed()
                .setColor("#FF0000")
                .setDescription("Aktifitas dan Status Kosong. Apa yang kamu harapkan sayang?")
                msg.reply({embeds:[embedError]})
            }
            else if(statusData == undefined){
                client.user.setPresence({ activities: [{ name: aktifitas }]});
                updateJSON({ activities:aktifitas, status:statusData})
                const embedError = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription("Oke, sayang!")
                msg.reply({embeds:[embedError]})
            }
            else if(aktifitas == undefined){
                if(!["online", "idle", "dnd","offline"].includes(statusData)){
                    const embedError = new MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("Status hanya bisa online, offline, idle, dan do not disturb doang, sayang...")
                    msg.reply({embeds:[embedError]})
                }
                else{
                    client.user.setPresence({ status: statusData });
                    updateJSON({ activities:aktifitas, status:statusData})
                    const embedError = new MessageEmbed()         
                    .setColor("	#00FF00")
                    .setDescription("Oke, sayang!")
                    msg.reply({embeds:[embedError]})
                }
            }
            else{
                if(!["online", "idle", "dnd","offline"].includes(statusData)){
                    const embedError = new MessageEmbed()
                    .setColor("#FF0000")
                    .setDescription("Status hanya bisa online, offline, idle, dan do not disturb doang, sayang...")
                    msg.reply({embeds:[embedError]})
                }
                else{
                    client.user.setPresence({ activities: [{ name: aktifitas }],status: statusData });
                    updateJSON({ activities:aktifitas, status:statusData})
                    const embedError = new MessageEmbed()
                    .setColor("#00FF00")
                    .setDescription("Oke, sayang!")
                    msg.reply({embeds:[embedError]})
                }   
            }
        }
    }
}

async function updateJSON(object) {
    try{
        const buffer = await readFile("./status.json");
        const json = JSON.parse(buffer.toString());
        Object.assign(json, object);
        await writeFile("./status.json", JSON.stringify(json));
    }
    catch(error) {
        console.log(error);
    }
}

export default command;