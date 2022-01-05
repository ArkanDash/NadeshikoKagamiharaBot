import { MessageEmbed } from 'discord.js'

const prefix = "."

export default function messageHandler(client) {
    client.on("messageCreate", async msg => {
        if(msg.author.bot) return;
        if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
        if(msg.guild.id == "783343899565490246"){
            const args = msg.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            if(command == "ohayo" && msg.channel.id == "926734032937578517"){
                    msg.delete()
                client.commands.get('send-embed').execute(msg, client);
            }
            else if(command == "help" && msg.channel.id == "926734032937578517"){
                msg.delete()
                client.commands.get('help').execute(msg, client);
            }
            else if(command == "me"){
                client.commands.get('info-me').execute(msg, client)
            }
            
        }
    })

    client.on("messageCreate", async msg =>{
        const haramWords = ["hentai","nhentai","nekopoi","bokep","kontol","titit","titid","tytyd","tytyt","mengontol","gontol","ngocok","goblok","geblek","bangsat", "porn", "memek", "jancok", "ngentot", "entot", "ngewe", "nigga", "gay", "sex"]
        if(msg.content){
            for (var i = 0; i < haramWords.length; i++) {
                if (msg.content.toLowerCase().includes(haramWords[i])) {
                    client.commands.get('warn-user').execute(msg, client)
                    break;
                }
            }
        }
    })

    client.on('guildMemberAdd', async member =>{
        //Send a message if user is join
        const channelJoinId = '783343899996323911'
        const message = `Selamat datang di ${member.guild.name}, <@${member.id}>.\nTolong baca peraturan di <#919417694397268059> dulu. Semoga betah disini ya ⛺`
        const channel = member.guild.channels.cache.get(channelJoinId)

        channel.send(message);
    })

    client.on('guildMemberRemove', async member =>{
        //Send a message if user is left
        const channelLeaveId = '783343899996323911'
        const message = `Selamat tinggal, ${member.displayName}, kapan-kapan kesini lagi ya 🚲!`
        
        const channel = member.guild.channels.cache.get(channelLeaveId)
        channel.send(message);
    })
}
