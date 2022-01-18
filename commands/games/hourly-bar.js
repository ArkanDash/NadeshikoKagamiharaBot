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
            for(let i = 0; i < data.length; i++){
                let userIDCheck = data[i].userID
                let user = await userProfile.findOne({ userIDCheck });
                if(user.campFire <= 0) return
                await findUserAndUpdateCampfire(userIDCheck, user)
            }
        });
        cron.schedule('0 */3 * * *', async () =>{
            //Setiap 3 Jam
            for(let i = 0; i < data.length; i++){
                let userIDCheck = data[i].userID
                let user = await userProfile.findOne({ userIDCheck });
                if(user.hunger <= 0) return
                await findUserAndUpdateFood(userIDCheck, user)
            }
        })
    }
}

export default command;

async function findUserAndUpdateCampfire(userID, user){
    let campfireDecrease = await rndInt(5, 15)
    let object = {
        campFire: user.campFire - campfireDecrease
    }
    let updateData = await userProfile.findOneAndUpdate({ userID }, object)
    //console.log("id:" + userID, "after update value:"+ object.campFire, "old value:" + updateData.campFire)
}

async function findUserAndUpdateFood(userID, user){
    let hungerDecrease = await rndInt(10, 25)
    let object = {
        hunger: user.hunger - hungerDecrease
    }
    let updateData = await userProfile.findOneAndUpdate({ userID }, object)
    //console.log("id:" + userID, "after update value:"+ object.campFire, "old value:" + updateData.campFire)
}

async function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}