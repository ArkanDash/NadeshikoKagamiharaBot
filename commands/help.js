import { MessageEmbed } from 'discord.js'

const command = {
    name:"help",
    description:"Help message",
    async execute(msg, client){
        const embed = new MessageEmbed()
        .setTitle("List Kategori Command")
        .addFields(
            {
                name: "General Command",
                value: "**.character**: List karakter di anime yuru camp."
            },
            {
                name: "Game Command",
                value: "**.profile**: Create Game Profile/View Profile\n**.collect**: Collect item.\n**.daily**: Daily reward\n**.balance**: Check money\n**.shop**: Zebra Supermarket\n**.buy**: Buying food at zebra supermarket\n**.sell**: Sell item\n**.eat**: Eat food or snack\n**.burn**: Burning fuel for a campfire\n**.camp**: Move camp\n**.work**: Work to get money\n**.sleep**: Sleep\n**.wake**: Awake from sleeping\n**.delete**: Remove account"
            }
        )
        .setColor("#FFFF00")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;