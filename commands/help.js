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
                name: "Game",
                value: "**.profile**: Buat profile game/cek profile\n**.collect**: Mengumpulkan item.\n**.daily**: Hadiah harian\n**.balance**: Check uang\n**.shop**: Zebra Supermarket\n**.buy**: Membeli makanan di zebra supermarket\n**.sell**: Jual item\n**.eat**: Makan makanan\n**.burn**: Membakar bahan bakar untuk api unggun\n**.camp**: Upgrade kamp\n**.work**: Bekerja untuk mendapatkan uang\n**.sleep**: Tidur\n**.wake**: Bangun dari tidur"
            }
        )
        .setColor("#FFFF00")
        msg.channel.send({embeds:[embed]})
    }
}

export default command;