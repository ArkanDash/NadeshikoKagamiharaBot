import mongoose from "mongoose";
import { readFile } from "fs/promises";

const profileSchema = new mongoose.Schema(
    {
        //User Data
        userID: {type: String, required: true, unique:true},
        money: {type: Number, default: 2500},
        //Camp Area
        camps: {type: Object, default: {
            yourCamp: 0,
            allCamp: [
                "Danau Motosu",
                "Perkemahan Kōan",
                "Perkemahan Fumotoppara",
                "Dataran Tinggi Takabocchi",
                "Danau Shibire",
                "Jukaino Bokujou",
                "Gunung Fuji"  
            ],
            campCost: [
                5000,
                25000,
                50000,
                250000,
                750000,
                1500000
            ]
        }},
        //Food
        foods: {type: Object, default: {
            curryNoodles: 2,
            friedSoftBoiledEgg:0,
            beetAndBeefBorscht:0,
            soupPasta: 0,
            yakiton: 0,
            gyozaNabe: 0
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

        //User Customization
        footer: {type: String, default: ""}
    }
)

export default mongoose.model("UserProfile", profileSchema)