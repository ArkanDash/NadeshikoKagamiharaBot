const prefix = "."

const profileAlt = new Array("profile", "pr", "p")
const campAlt = new Array("camp", "cp")
const collectAlt = new Array("collect","clt","col")
const eatAlt = new Array("eat","e")
const balanceAlt = new Array("balance", "bal", "b")
const shopAlt = new Array("shop","s")
const dailyAlt = new Array("daily","d")

export default function gameHandler(client){
    client.on("messageCreate", async msg =>{
        if(msg.author.bot && msg.channel.id != "927118007564640289") return;
        if(msg.content.toLowerCase().indexOf(prefix) !== 0) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
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
            client.commands.get('eat-game').execute(msg, client)
        }
        else if(balanceAlt.includes(command)){
            client.commands.get('balance-game').execute(msg, client)
        }
        else if(shopAlt.includes(command)){
            client.commands.get('shop-game').execute(msg, client)
        }
        else if(dailyAlt.includes(command)){
            client.commands.get('daily-game').execute(msg, client)
        }
    })
}