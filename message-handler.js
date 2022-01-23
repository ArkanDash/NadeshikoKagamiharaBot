import { MessageEmbed } from 'discord.js'

const character = new Array("character", "char")
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
        else if(character.includes(command)){
            client.commands.get('info-character').execute(msg, client)
        }
        else if(command == "welcometest" && msg.channel.id == "926734032937578517"){
            client.commands.get('welcome-image').execute(msg, client)
        }
    })

    client.on('guildMemberAdd', async member =>{
        //Send a message if user is join
        const channelJoinID = '783343899996323911'
        const message = `Selamat datang <@${member.id}>, semoga betah disini ya ⛺!`
        
        const channel = member.guild.channels.cache.get(channelJoinID)
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
