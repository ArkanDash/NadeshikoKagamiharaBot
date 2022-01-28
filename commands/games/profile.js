import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import userProfile from "../../schema/profile-scheme.js"
import { readFile } from "fs/promises"
import ms from 'parse-ms'

const command = {
    name:"profile-game",
    description:"Profile Game",
    async execute(msg, user, client){
        let profileData;
        const id = msg.author.id
        const userData = msg.mentions.users.first() || msg.member.user;
        const member = msg.guild.members.cache.get(userData.id)
        try{
            profileData = await userProfile.findOne({ userID: userData.id })
        }
        catch(e){
            console.log(e)
        }

        if(!profileData){
            profileData = await userProfile.create({
                userID: id,
                money: 2500,
                foods: JSON.parse(await readFile("./json/food.json")),
                items: JSON.parse(await readFile("./json/items.json"))   
            })
            profileData.save()

            //Snacks
            let egg = profileData.foods.friedSoftBoiledEgg || 0
            let cookie = profileData.foods.cookie || 0
            let smore = profileData.foods.smore || 0
            let shimarindango = profileData.foods.shimarinDango || 0
            let mochi = profileData.foods.mochi || 0
            //Foods
            let currynoodle = profileData.foods.curryNoodles || 0
            let borscht = profileData.foods.beetAndBeefBorscht || 0
            let souppasta = profileData.foods.soupPasta || 0
            let yakiton = profileData.foods.yakiton || 0
            let gyozanabe = profileData.foods.gyozaNabe || 0
            let sukiyaki = profileData.foods.sukiyaki || 0

            const embed = new MessageEmbed()
            .setDescription("Your account has been created!")
            .setColor("#00FF00")
            const embed2 = new MessageEmbed()
            
            const yourCamp = await checkCamp(profileData.camp)
            embed2.setDescription(`Your camp is at ${yourCamp}`)
            embed2.setTitle(`${msg.author.username}#${msg.author.discriminator} Profile`)
            embed2.setThumbnail(msg.author.displayAvatarURL())
            embed2.setColor("#800080")
            embed2.addFields(
                { 
                    name: 'Total Money', value: `💴 ${profileData.money} yen`
                },
                {
                    name: 'Snacks', value: `Fried Soft-Boiled Egg x${egg}\nCookie x${cookie}\nSmore x${smore}\nShimarin Dango x${shimarindango}\nMochi x${mochi}`, inline:true
                },
                {
                    name: 'Foods', value: `Curry Noodle x${currynoodle}\nBeet and Beef Borscht x${borscht}\nSoup Style Pasta x${souppasta}\nYakiton x${yakiton}\nGyoza Nabe x${gyozanabe}\nSukiyaki x${sukiyaki}`, inline:true
                },
                {
                    name: 'Items', value: `<:yc_pinecone:927725824881336350> Pinecone x${profileData.items.pinecone}\n<:yc_stick:933994005048479765> Wooden Stick x${profileData.items.stick}\n:wood: Wood Log x${profileData.items.wood}`
                },
                {
                    name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
                },
                {
                    name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
                }
            )
            if(/\.(jpg|gif|png)$/.test(profileData.bannerImage)){
                embed.setImage(profileData.bannerImage)
            }
            else{
                embed.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
            }
        
            if(/\.(jpg|gif|png)$/.test(profileData.footerLink)){
                embed.setFooter({
                    text:profileData.footerText,
                    iconURL:profileData.footerLink
                })
            }
            else if(profileDataData.footerText){
                embed.setFooter({
                    text:profileData.footerText
                })   
            }
            msg.channel.send({embeds:[embed, embed2]})
        }
        else{
            let userEmbed = userProfileEmbed(msg, userData, member, profileData)
            const msgDropDownFirst = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('profile-user')
                    .addOptions(
                        {
                            label: 'User Profile',
                            description: 'User Game Profile Information',
                            value: 'first_option',
                            default: true
                        },
                        {
							label: 'User Cooldown',
							description: 'All cooldowns of this user.',
							value: 'second_option'
						},
						{
							label: 'User Collection',
							description: 'All collections of this user.',
							value: 'third_option'
						}
                    )

            )
            const msgDropDownSecond = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('profile-user')
                    .addOptions(
                        {
                            label: 'User Profile',
                            description: 'User Game Profile Information',
                            value: 'first_option'
                        },
                        {
							label: 'User Cooldown',
							description: 'All cooldowns of this user.',
							value: 'second_option',
                            default: true
						},
						{
							label: 'User Collection',
							description: 'All collections of this user.',
							value: 'third_option'
						}
                    )

            )
            const msgDropDownThird = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('profile-user')
                    .addOptions(
                        {
                            label: 'User Profile',
                            description: 'User Game Profile Information',
                            value: 'first_option'
                        },
                        {
							label: 'User Cooldown',
							description: 'All cooldowns of this user.',
							value: 'second_option'
						},
						{
							label: 'User Collection',
							description: 'All collections of this user.',
							value: 'third_option',
                            default: true
						}
                    )
            )
            let newMsg = await msg.channel.send({embeds:[userEmbed], components: [msgDropDownFirst]})

            const filter = (i) => {return i.user.id === msg.author.id};
            const collector = newMsg.createMessageComponentCollector({ filter, time: 1000 * 30 });
            
            collector.on('collect', async (interaction) => {
                if (!interaction.isSelectMenu()) return;

                if(interaction.values == 'first_option'){
                    let newUserEmbed = userProfileEmbed(msg, userData, member, profileData)
                    interaction.update({embeds: [newUserEmbed],components: [msgDropDownFirst] });
                }
                else if(interaction.values == 'second_option'){
                    let newCooldownEmbed = userCooldownEmbed(msg, userData, member, profileData)
                    interaction.update({embeds: [newCooldownEmbed],components: [msgDropDownSecond] });
                }
                else if(interaction.values == 'third_option'){
                    let newCollectionEmbed = userColletionEmbed(msg, userData, member, profileData)
                    interaction.update({embeds: [newCollectionEmbed],components: [msgDropDownThird] });
                }
            });
            
            collector.on('end', async (collected) => {});
        }
    }
}

export default command;

function checkCamp(id){
    let yourCamp;
    if(id == 0){
        yourCamp = "Lake Motosu"
    }
    else if(id == 1){
        yourCamp = "Kōan Campsite"
    }
    else if(id == 2){
        yourCamp = "Fumotoppara Campsite"
    }
    else if(id == 3){
        yourCamp = "Takabocchi Highlands"
    }
    else if(id == 4){
        yourCamp = "Shibire Lake"
    }
    else if(id == 5){
        yourCamp = "Jukaino Bokujou"
    }
    else if(id == 6){
        yourCamp = "Lake Yamanaka"
    }
    return yourCamp;
}

function userProfileEmbed(msg, userData, member, profileData){
    //Snacks
    let egg = profileData.foods.friedSoftBoiledEgg || 0
    let cookie = profileData.foods.cookie || 0
    let smore = profileData.foods.smore || 0
    let shimarindango = profileData.foods.shimarinDango || 0
    let mochi = profileData.foods.mochi || 0
    //Foods
    let currynoodle = profileData.foods.curryNoodles || 0
    let borscht = profileData.foods.beetAndBeefBorscht || 0
    let souppasta = profileData.foods.soupPasta || 0
    let yakiton = profileData.foods.yakiton || 0
    let gyozanabe = profileData.foods.gyozaNabe || 0
    let sukiyaki = profileData.foods.sukiyaki || 0

    const embed = new MessageEmbed()
    if(userData != msg.member.user){
        embed.setTitle(`${userData.username}#${userData.discriminator} Game Profile`)
        embed.setThumbnail(member.displayAvatarURL())
    }
    else{
        embed.setTitle(`${msg.author.username}#${msg.author.discriminator} Game Profile`)
        embed.setThumbnail(msg.author.displayAvatarURL())
    }
    const yourCamp = checkCamp(profileData.camp)
    embed.setDescription(`Your camp is at ${yourCamp}`)
    embed.setColor("#800080")
    embed.addFields(
        { 
            name: 'Total Money', value: `💴 ${profileData.money} yen`
        },
        {
            name: 'Snacks', value: `Fried Soft-Boiled Egg x${egg}\nCookie x${cookie}\nSmore x${smore}\nShimarin Dango x${shimarindango}\nMochi x${mochi}`, inline:true
        },
        {
            name: 'Foods', value: `Curry Noodle x${currynoodle}\nBeet and Beef Borscht x${borscht}\nSoup Style Pasta x${souppasta}\nYakiton x${yakiton}\nGyoza Nabe x${gyozanabe}\nSukiyaki x${sukiyaki}`, inline:true
        },
        {
            name: 'Items', value: `<:yc_pinecone:927725824881336350> Pinecone x${profileData.items.pinecone}\n<:yc_stick:933994005048479765> Wooden Stick x${profileData.items.stick}\n:wood: Wood Log x${profileData.items.wood}`
        },
        {
            name: 'Campfire', value: `<a:yc_campfire:927127127244017675> ${profileData.campFire}%`, inline: true
        },
        {
            name: 'Hunger', value: `⚡ ${profileData.hunger}%`, inline: true
        }
    )
    
    if(/\.(jpg|gif|png)$/.test(profileData.bannerImage)){
        embed.setImage(profileData.bannerImage)
    }
    else{
        embed.setImage("https://static.wikia.nocookie.net/yuru-camp/images/5/57/Yuru_Camp_Art.jpg")
    }

    if(/\.(jpg|gif|png)$/.test(profileData.footerLink)){
        embed.setFooter({
            text:profileData.footerText,
            iconURL:profileData.footerLink
        })
    }
    else if(profileDataData.footerText){
        embed.setFooter({
            text:profileData.footerText
        })   
    }
    
    return embed
}

function userCooldownEmbed(msg, userData, member, profileData){
    const now = new Date().getTime()
    let then = [new Date(profileData.collectCooldown).getTime(), new Date(profileData.workCooldown).getTime(), new Date(profileData.dailyCooldown).getTime(), new Date(profileData.campCooldown).getTime()]
    let timeout = [ 300000, 3600000, 86400000, 259200000]
    let nameCommand = ["Collect Cooldown", "Work Cooldown", "Daily Cooldown", "Camp Cooldown"]

    let embed = new MessageEmbed()
    embed.setTitle(`${userData.username}#${userData.discriminator} Cooldown Profile`)
    .setColor("#800080")
    for(let i = 0; i < 4; i++){
        if(timeout[i] - (now - then[i]) > 0){
            let timeLeft = (ms(timeout[i] - (now - then[i])))
            if(timeout[i] == 300000){
                embed.addField(`${nameCommand[i]}`, `${timeLeft.minutes} minute and ${timeLeft.seconds} second left.`)
            }
            else if(timeout[i] == 259200000){
                embed.addField(`${nameCommand[i]}`, `${timeLeft.days} days ${timeLeft.hours} hour ${timeLeft.minutes} minute and ${timeLeft.seconds} second left.`)
            }
            else{
                embed.addField(`${nameCommand[i]}`, `${timeLeft.hours} hour ${timeLeft.minutes} minute and ${timeLeft.seconds} second left.`)
            }
        }
        else{
            embed.addField(`${nameCommand[i]}`, `This command is ready to use!`)
        }
    }

    if(profileData.sleep){
        let thenWake = new Date(profileData.wakeCooldown).getTime()
        let timeoutwake = 10800000
        if(timeoutwake - (now - thenWake) > 0){
            let timeLeft = (ms(timeoutwake - (now - thenWake)))
            embed.addField(`Wake Command`, `${timeLeft.hours} hour ${timeLeft.minutes} minute and ${timeLeft.seconds} second left`)
        }
        else{
            embed.addField(`Wake Command`, `This command is ready to use!`)
        }
    }
    else{
        let thensleep = new Date(profileData.sleepCooldown).getTime()
        let timeoutsleep = 28800000
        if(timeoutsleep - (now - thensleep) > 0){
            let timeLeft = (ms(timeoutsleep - (now - thensleep)))
            embed.addField(`Sleep Command`, `${timeLeft.hours} hour ${timeLeft.minutes} minute and ${timeLeft.seconds} second left`)
        }
        else{
            embed.addField(`Sleep Command`, `This command is ready to use!`)
        }
    }
    return embed
}
function userColletionEmbed(msg, userData, member, profileData){
    let embed = new MessageEmbed()

    if(profileData.collections.shippeitaro){
        embed.setTitle(`${userData.username}#${userData.discriminator} Collection Profile`)
        .setDescription('Shippeitaro-shapped Omikuji')
        .setImage('https://cdn.discordapp.com/attachments/934324669312532501/936393638919938089/shippeitaro.png')
        .setColor("#FFD700")
    }
    else{
        embed.setTitle(`${userData.username}#${userData.discriminator} Collection Profile`)
        .setDescription(`This user don't have any collection!`)
        .setColor("#800080")
    }
    return embed
}