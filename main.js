import Discord, { Intents, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { readFile } from "fs/promises";
import { resolve } from 'path';
import { type } from 'os';
import messageHandler from './message-handler.js';
import gameHandler from './game-handler.js';
import mongoose from 'mongoose';
dotenv.config()
const mongooseAccess = process.env.TOKEN_URI

mongoose.connect(mongooseAccess, { keepAlive: true }).then(data=>{console.log("MongoDB Connected!")}).catch(err=> {console.log(err)})

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
    ]}
);

client.commands = new Collection();

const commandFiles = (await fs.promises.readdir('./commands/')).filter(file => file.endsWith('.js'))
const gamesFiles = (await fs.promises.readdir('./commands/games')).filter(file => file.endsWith('.js'))

for(const file of commandFiles){
    let src = resolve(resolve(), `./commands/${file}`);
    src = type() === 'Windows_NT' ? `file://${src}` : src;
    const { default: command } = await import(src); 
    client.commands.set(command.name, command);
}
for(const file of gamesFiles){
    let src = resolve(resolve(), `./commands/games/${file}`);
    src = type() === 'Windows_NT' ? `file://${src}` : src;
    const { default: commandGame } = await import(src); 
    client.commands.set(commandGame.name, commandGame);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const presence = JSON.parse(await readFile("./status.json"));
    client.user.setPresence({ activities: [{ name: presence.activities }], status: presence.status });

    messageHandler(client);
    gameHandler(client);
    //'client.commands.get('bar').execute(client)
});

//                       \\
//  INTERACTION HANDLER  \\
//                       \\

client.on("ready", async () => {
    const guildId = '927118007564640286';
    const guild = client.guilds.cache.get(guildId);
    let slashCmd;

    if(guild){
        slashCmd = guild.commands;
    }
    else {
        slashCmd = client.application.commands;
    }

    slashCmd.create({
        name:'custom-status',
        description:'Custom Status',
        options: [
            {
                name:'aktivitas',
                description:'Ohayou Gozaimasu!',
                type:Discord.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name:'status',
                description:'Online, Idle, Do Not Disrupt',
                choices:[
                    {
                        name:"Online",
                        value:"online"
                    },
                    {
                        name:"Idle",
                        value:"idle"
                    },
                    {
                        name:"Do Not Disturb",
                        value:"dnd"
                    },
                    {
                        name:"Offline",
                        value:"offline"
                    }
                ],
                type:Discord.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    slashCmd.create({
        name:'custom-footer-game',
        description:'Kustom footer untuk profile camp game',
        options: [
            {
                name:'footer',
                description:'Tuliskan deskripsi/kalimat untuk footer',
                required:true,
                type:Discord.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name:'image-footer',
                description:'Gambar kecil di footer. [IMAGE LINK ONLY]',
                type:Discord.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
    slashCmd.create({
        name:'custom-banner-image',
        description:'Kustom gambar banner untuk profile camp game',
        options: [
            {
                name:'banner-image',
                description:'Link Image banner',
                required:true,
                type:Discord.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })
})


client.on("interactionCreate", async interaction =>{
    if(!interaction.isCommand()) return;
            
    const { commandName , options } = interaction;

    if(commandName == "custom-status"){
        const activities = options.getString(`aktivitas`) || undefined
        const status = options.getString(`status`) || undefined
        client.commands.get('custom-presence').execute(interaction, activities, status, client);
    }
    else if(commandName == "custom-footer-game"){
        const footerText = options.getString(`footer`)
        const imageLink = options.getString(`image-footer`) || ""
        client.commands.get('footer-game').execute(interaction, footerText, imageLink, client);
    }
    else if(commandName == "custom-banner-image"){
        const imageLink = options.getString(`banner-image`) || ""
        client.commands.get('banner-game').execute(interaction, imageLink, client);
    }
})

client.login(process.env.TOKEN);