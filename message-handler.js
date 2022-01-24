import { MessageEmbed } from 'discord.js'

const character = new Array("character", "char")
const prefix = "."

export default function messageHandler(client) {
    client.on("messageCreate", async msg => {
        if(msg.author.bot) return;
        if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(command == "help"){
            client.commands.get('help').execute(msg, client);
        }
        else if(character.includes(command)){
            client.commands.get('info-character').execute(msg, client)
        }
    })
}
