import mongoose from "mongoose";
import { readFile } from "fs/promises";

const profileSchema = new mongoose.Schema(
    {
        //User Data
        userID: {type: String, required: true, unique:true},
        money: {type: Number, default: 1000},
        //Camp Area
        camps: {type: Object, default: {
            yourCamp: 0,
            allCamp: [
                "Danau Motosu",
                "Perkemahan Kōan",
                "Perkemahan Fumotoppara",
                "Dataran Tinggi Takabocchi",
                "Jukaino Bokujou",
                "Gunung Fuji"
            ],
            campCost: [
                2500,
                10000,
                30000,
                75000,
                125000
            ]
        }},
        //Food
        foods: {type: Object, default: {
            pinecone: 10,
            stick: 5,
            wood: 0
        }},

        //Items
        items: { type: Object, default:{
            curryNoodles: 2,
            soupPasta: 0,
            friedSoftBoiledEgg:0,
            yakiton: 0,
            gyozaNabe: 0
        }},

        

        //Cooldown Command
        dailyCooldown: {type: Date, default: new Date(2018, 11)},
        collectCooldown: {type: Date, default: new Date(2018, 11)}
    }
)

export default mongoose.model("UserProfile", profileSchema)