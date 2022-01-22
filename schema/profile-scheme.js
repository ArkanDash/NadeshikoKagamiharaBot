import mongoose from "mongoose";
import { readFile } from "fs/promises";

const profileSchema = new mongoose.Schema(
    {
        //User Data
        userID: {type: String, required: true, unique:true},
        money: {type: Number, default: 2500},
        sleep: {type: Boolean, default: false},
        camp: {type: Number, default: 0},

        //Food
        foods: {type: Object, default: {
            friedSoftBoiledEgg:0,
            cookie:5,
            smore:0,
            shimarinDango:0,
            mochi:0,
            curryNoodles: 2,
            beetAndBeefBorscht:0,
            soupPasta: 0,
            yakiton: 0,
            gyozaNabe: 0,
            sukiyaki: 0
        }},

        //Items
        items: { type: Object, default:{
            pinecone: 10,
            stick: 5,
            wood: 0
        }},

        //Data Progress
        campFire:{type: Number, default: 80},
        hunger:{type: Number, default: 80},

        //Cooldown Command
        dailyCooldown: {type: Date, default: new Date(2018, 11)},
        collectCooldown: {type: Date, default: new Date(2018, 11)},
        campCooldown: {type: Date, default: new Date(2018, 11)},
        workCooldown: {type: Date, default: new Date(2018, 11)},
        sleepCooldown: {type: Date, default: new Date(2018, 11)},
        wakeCooldown: {type: Date, default: new Date(2018, 11)},

        //User Customization
        bannerImage: {type: String, default: ""},
        footerText: {type: String, default: ""},
        footerLink: {type: String, default: ""}
    }
)

export default mongoose.model("UserProfile", profileSchema)