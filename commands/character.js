import { MessageEmbed } from 'discord.js'

const command = {
    name:"info-character",
    description:"About me",
    async execute(msg, client){
        let char = await Character()
        let characterPage = 0;
        let charMsg = await msg.channel.send({embeds:[char[0]]})
        await charMsg.react("◀️")
        await charMsg.react("▶️")

        const filter = (reaction, user) => {return user.id == msg.author.id;}
    
        const collector = charMsg.createReactionCollector({
            filter,
            time: 1000 * 60
        })
    
        collector.on('collect', (reaction, user) => {
            let text = reaction.emoji.name
            if(text == "◀️" && characterPage > 0){
                characterPage -= 1;
                charMsg.edit({embeds:[char[characterPage]]})
                reaction.users.remove(user.id)
            }
            else if(text == "▶️" && characterPage < 4){
                characterPage += 1;
                charMsg.edit({embeds:[char[characterPage]]})
                reaction.users.remove(user.id)
            }
        })
    
        collector.on('end', async (collected) => {
            if(collected.size == 0){
                const embed = new MessageEmbed()
                .setDescription("Waktu reaksi habis!")
                .setColor("#FF0000")
                charMsg.edit({embeds:[embed]})
                return
            }
        })
    }
}


export default command;

async function Character(){
    const embed = new MessageEmbed()
    .setTitle("『 __Rin Shima__ 』")
    .setAuthor({
        name:"Yuru Camp",
        iconURL:"https://implyingrigged.info/w/images/thumb/8/86/Yucamp_logo.png/250px-Yucamp_logo.png"
    })
    .setURL("https://yuru-camp.fandom.com/wiki/Rin_Shima")
    .setDescription("Rin Shima (志摩 リン, Shima Rin) is a young girl in Yuru Camp△ who is a student at Motosu High School and enjoys camping, but she usually camps by herself until she meets Nadeshiko Kagamihara.")
    .setColor("#3A70AD")
    .setImage("https://static.wikia.nocookie.net/yuru-camp/images/d/d6/Rin_character_sheet.png")
    .addFields([
        {
            name:"Nickname",
            value:"Rin\nShimarin",
            inline:true
        },
        {
            name:"Birthday",
            value:"October 1",
            inline:true
        },
        {
            name:"Gender",
            value:"Female",
            inline:true
        }
    ])
    .setFooter({
        text:'Kuma!?',
        iconURL:'https://pbs.twimg.com/profile_images/1296518506301624320/XRdzKyzI_400x400.jpg'
    });
    const embed2 = new MessageEmbed()
    .setTitle("『 __Nadeshiko Kagamihara__ 』")
    .setAuthor({
        name:"Yuru Camp",
        iconURL:"https://implyingrigged.info/w/images/thumb/8/86/Yucamp_logo.png/250px-Yucamp_logo.png"
    })
    .setURL("https://yuru-camp.fandom.com/wiki/Nadeshiko_Kagamihara")
    .setDescription("Nadeshiko Kagamihara (各務原 なでしこ) is a young girl who appears in Yuru Camp△ as recent transfer to Motosu High School from Nanbu-chō (Nanbu town), the daughter of Shūichirō Kagamihara and Shizuka Kagamihara and the younger sister of Sakura Kagamihara. She previously lived in Hamamatsu city on the the southern coast of Shizuoka prefecture.")
    .setColor("#FB9BC9")
    .setImage("https://static.wikia.nocookie.net/yuru-camp/images/c/cd/Nadeshiko_character_sheet.png")
    .addFields([
        {
            name:"Nickname",
            value:"Nadeshiko\nFujiko\nMamashiko",
            inline:true
        },
        {
            name:"Birthday",
            value:"4 Maret",
            inline:true
        },
        {
            name:"Gender",
            value:"Female",
            inline:true
        }
    ])
    .setFooter({
        text:'Umai~~',
        iconURL:'https://i.pinimg.com/originals/97/f5/85/97f5859df5fd2917a6498188dafbd616.png'
    });
    const embed3 = new MessageEmbed()
    .setTitle("『 __Aoi Inuyama__ 』")
    .setAuthor({
        name:"Yuru Camp",
        iconURL:"https://implyingrigged.info/w/images/thumb/8/86/Yucamp_logo.png/250px-Yucamp_logo.png"
    })
    .setURL("https://yuru-camp.fandom.com/wiki/Aoi_Inuyama")
    .setDescription("Aoi Inuyama (犬山 あおい Inuyama Aoi) is a high-school girl in Yuru Camp△ who is a student at Motosu High School. She is a founding member of The Outdoor Activities Club.")
    .setColor("#9CE31B")
    .setImage("https://static.wikia.nocookie.net/yuru-camp/images/e/ed/Aoi_character_sheet.png")
    .addFields([
        {
            name:"Nickname",
            value:"Inuko\nInuko-san",
            inline:true
        },
        {
            name:"Birthday",
            value:"4 Maret",
            inline:true
        },
        {
            name:"Gender",
            value:"Female",
            inline:true
        }
    ])
    .setFooter({
        text:'Uso yade...',
        iconURL:'https://64.media.tumblr.com/1bea2cb93c62e8ca55d3efeadb317933/3c5a7f622beef1af-ee/s250x400/f136554da3b96993d1b227b548f8c749850a8193.png'
    });
    const embed4 = new MessageEmbed()
    .setTitle("『 __Chiaki Ōgaki__ 』")
    .setAuthor({
        name:"Yuru Camp",
        iconURL:"https://implyingrigged.info/w/images/thumb/8/86/Yucamp_logo.png/250px-Yucamp_logo.png"
    })
    .setURL("https://yuru-camp.fandom.com/wiki/Chiaki_%C5%8Cgaki")
    .setDescription("Chiaki Ōgaki (大垣 千明 Ōgaki Chiaki) is a high-school girl in Yuru Camp△ who is a student at Motosu High School. She is a founding member of The Outdoor Activities Club.")
    .setColor("#C13557")
    .setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/55/Chiaki_character_sheet.png")
    .addFields([
        {
            name:"Nickname",
            value:"Aki",
            inline:true
        },
        {
            name:"Birthday",
            value:"31 Agustus",
            inline:true
        },
        {
            name:"Gender",
            value:"Female",
            inline:true
        }
    ])
    .setFooter({
        text:'Nande...',
        iconURL:'https://64.media.tumblr.com/1500a9af0136c8412a5ccb4d179ca6cc/e5a768d2ae422313-66/s400x600/3a1098956fab617c906cfe088cd49510d9382272.png'
    });
    const embed5 = new MessageEmbed()
    .setTitle("『 __Ena Saitō__ 』")
    .setAuthor({
        name:"Yuru Camp",
        iconURL:"https://implyingrigged.info/w/images/thumb/8/86/Yucamp_logo.png/250px-Yucamp_logo.png"
    })
    .setURL("https://yuru-camp.fandom.com/wiki/Ena_Sait%C5%8D")
    .setDescription(`Ena Saitō (斉藤 恵那, Saitō Ena) is a young girl in Yuru Camp△ who is a student at Motosu High School and first appears in "Welcome to the Outdoor Activities Club!" as a friend of Rin.`)
    .setColor("#F98B01")
    .setImage("https://static.wikia.nocookie.net/yuru-camp/images/7/73/Ena_character_sheet.png")
    .addFields([
        {
            name:"Nickname",
            value:"Ena",
            inline:true
        },
        {
            name:"Birthday",
            value:"1 September",
            inline:true
        },
        {
            name:"Gender",
            value:"Female",
            inline:true
        }
    ])
    .setFooter({
        text:'Chikuwa... Oide...',
        iconURL:'https://64.media.tumblr.com/35edfccd3588c1dc4053b94ccfe04525/tumblr_p6qxzgkPcI1uctmvwo3_1280.png'
    });

    let allEmbed = [ embed, embed2, embed3, embed4, embed5 ]
    return allEmbed;
}