import { Client } from "discord.js"

const prefix = "."

const profileAlt = new Array("profile", "pr", "p")
const campAlt = new Array("camp", "cp")
const collectAlt = new Array("collect", "col", "c")
const eatAlt = new Array("eat","e")
const balanceAlt = new Array("balance", "bal")

const shopAlt = new Array("shop")
const buyAlt = new Array("buy", "b")

const dailyAlt = new Array("daily", "d")
const sellAlt = new Array("sell", "s")
const burnAlt = new Array("burn", "br")
const sleepAlt = new Array("sleep", "sp")
const wakeAlt = new Array("wake", "wk")
const workAlt = new Array("work", "w")

export default function gameHandler(client){
    client.on("messageCreate", async msg =>{
        if(msg.author.bot) return;
        if(msg.channel.id != "927118007564640289") return;
        if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;
        
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        try{
            if(profileAlt.includes(command)){
                client.commands.get('profile-game').execute(msg, client)
            }
            else if(campAlt.includes(command)){
                client.commands.get('camp-game').execute(msg, client)
            }
            else if(collectAlt.includes(command)){
                client.commands.get('collect-game').execute(msg, client)
            }
            else if(eatAlt.includes(command)){
                client.commands.get('eat-game').execute(msg, args[0], args[1], client)
            }
            else if(balanceAlt.includes(command)){
                client.commands.get('balance-game').execute(msg, client)
            }
            else if(shopAlt.includes(command)){
                client.commands.get('shop-game').execute(msg, client)
            }
            else if(buyAlt.includes(command)){
                client.commands.get('buy-game').execute(msg, args[0], args[1], client)
            }
            else if(dailyAlt.includes(command)){
                client.commands.get('daily-game').execute(msg, client)
            }
            else if(sellAlt.includes(command)){
                client.commands.get('sell-game').execute(msg, args[0], args[1], client)
            }
            else if(burnAlt.includes(command)){
                client.commands.get('burn-game').execute(msg, args[0], args[1], client)
            }
            else if(sleepAlt.includes(command)){
                client.commands.get('sleep-game').execute(msg, client)
            }
            else if(wakeAlt.includes(command)){
                client.commands.get('wake-game').execute(msg, client)
            }
            else if(workAlt.includes(command)){
                client.commands.get('work-game').execute(msg, client)
            }
            else if(command === "test"){
                client.commands.get('test').execute(msg, client)
            }
        }
        catch(e){
            console.log(e)
        }
    })
}