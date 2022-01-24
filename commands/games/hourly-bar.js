import { MessageEmbed } from 'discord.js'
import userProfile from '../../schema/profile-scheme.js';
import cron from 'node-cron'

const command = {
    name:"bar",
    description:"Bar Changes",
    async execute(client){
        let data = await userProfile.find({})
        cron.schedule('*/30 * * * *', async () => {
            //Setiap 2 Jam
            console.log("reducing campfire...")
            //IF NEEDED TO CHECK
            //client.channels.cache.get("<Text Channel ID>").send("Campfire has been reduced.");
            for(let i = 0; i < data.length; i++){
                let userIDCheck = data[i].userID
                let user = await userProfile.findOne({ userIDCheck });
                if(user.campFire <= 0) return
                await findUserAndUpdateCampfire(userIDCheck, user)
                
            }
        });
        cron.schedule('0 */1 * * *', async () =>{
            //Setiap 3 Jam
            console.log("reducing hunger...")
            //IF NEEDED TO CHECK
            //client.channels.cache.get("<Text Channel ID>").send("Hunger has been reduced.");
            for(let i = 0; i < data.length; i++){
                let userIDCheck = data[i].userID
                let user = await userProfile.findOne({ userIDCheck });
                if(user.hunger <= 0) return
                if(user.sleep == true) return
                await findUserAndUpdateFood(userIDCheck, user)
                
            }
        })
    }
}

export default command;

async function findUserAndUpdateCampfire(userID, user){
    let campfireDecrease = await rndInt(7, 12)
    let object;
    if(user.campFire < campfireDecrease){
        object = {
            campFire: 0
        }
    }
    else{
        object = {
            campFire: user.campFire - campfireDecrease
        }
    }
    
    let updateData = await userProfile.findOneAndUpdate({ userID }, object)
    //console.log("id:" + userID, "after update value:"+ object.campFire, "old value:" + updateData.campFire)
}

async function findUserAndUpdateFood(userID, user){
    let hungerDecrease = await rndInt(7, 20)
    let object
    if(user.hunger < hungerDecrease){
        object = {
            hunger: 0
        }
    }
    else{
        object = {
            hunger: user.hunger - hungerDecrease
        }
    }
    let updateData = await userProfile.findOneAndUpdate({ userID }, object)
    //console.log("id:" + userID, "after update value:"+ object.campFire, "old value:" + updateData.campFire)
}

async function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}