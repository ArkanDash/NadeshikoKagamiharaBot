import { MessageEmbed } from 'discord.js'

const prefix = "."

export default function messageHandler(client) {
    client.on("messageCreate", async msg => {
        if(msg.author.bot) return;
        if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(command == "ohayo" && msg.channel.id == "926734032937578517"){
            client.commands.get('send-embed').execute(msg, client);
        }
        else if(command == "help"){
            client.commands.get('help').execute(msg, client);
        }
        else if(command == "me"){
            client.commands.get('info-me').execute(msg, client)
        }
        else if(command == "welcometest" && msg.channel.id == "926734032937578517"){
            client.commands.get('welcome-image').execute(msg, client)
        }
    })

    /*client.on("messageCreate", async msg =>{
        const haramWords = ["hentai","nhentai","nekopoi","bokep","kontol","titit","titid","tytyd","tytyt","mengontol","gontol","ngocok","goblok","geblek","bangsat", "porn", "memek", "jancok", "ngentot", "entot", "ngewe", "nigga", "gay", "sex"]
        if(msg.content){
            if(msg.author.id == "844617532517777409") return
            for (var i = 0; i < haramWords.length; i++) {
                if (msg.content.toLowerCase().includes(haramWords[i])) {
                    client.commands.get('warn-user').execute(msg, client)
                    break;
                }
            }
        }
    })*/

    client.on('guildMemberAdd', async member =>{
        //Send a message if user is join
        client.commands.get('welcome-image').execute(member, client)
    })

    client.on('guildMemberRemove', async member =>{
        //Send a message if user is left
        const channelLeaveId = '783343899996323911'
        const message = `Selamat tinggal, ${member.displayName}, kapan-kapan kesini lagi ya 🚲!`
        
        const channel = member.guild.channels.cache.get(channelLeaveId)
        channel.send(message);
    })
}
