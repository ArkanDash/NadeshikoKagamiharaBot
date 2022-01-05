import { MessageEmbed } from 'discord.js'

const command = {
    name:"info-me",
    description:"About me",
    async execute(msg, client){
        const embed = new MessageEmbed()
        .setTitle("『 __Nadeshiko Kagamihara__ 』")
        .setURL("https://yuru-camp.fandom.com/wiki/Nadeshiko_Kagamihara")
        .setDescription("Nadeshiko Kagamihara (各務原 ) adalah seorang gadis muda yang muncul di Yuru Camp△ sebagai transfer baru-baru ini ke Motosu High School dari Nanbu-ch (kota Nanbu), putri Shūichirō Kagamihara dan Shizuka Kagamihara dan adik perempuan Sakura Kagamihara. Dia sebelumnya tinggal di kota Hamamatsu di pantai selatan prefektur Shizuoka.")
        .setColor("#00FF00")
        .setImage("https://static.wikia.nocookie.net/yuru-camp/images/c/cd/Nadeshiko_character_sheet.png")
       .addFields([
            {
                name:"Nickname",
                value:"Nadeshiko\nFujiko\nMamashiko",
                inline:true
            },
            {
                name:"Birthday",
                value:"8 Maret",
                inline:true
            },
            {
                name:"Gender",
                value:"Perempuan",
                inline:true
            }
        ])
        .setFooter({
            text:'Tehe ~💓',
            iconURL:'https://i.pinimg.com/originals/97/f5/85/97f5859df5fd2917a6498188dafbd616.png'
        });
        msg.channel.send({embeds:[embed]})
    }
}


export default command;