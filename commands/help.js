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
                value: "**.me**: Saya."
            },
            {
                name: "Game",
                value: "**.profile**: Buat profile game/cek profile\n**.collect**: Mengumpulkan item.\n**.daily**: Hadiah Harian\n**.balance**: Check uang\n**.shop**: Zebra Supermarket\n**.sell**: Jual item\n**.eat**: Makan makanan\n**.burn**: Membakar bahan bakar untuk api unggun\n**.camp**: Upgrade Camp"
            }
        )
        .setColor("#FFFF00")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;