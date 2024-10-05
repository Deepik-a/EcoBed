    const mongoose = require('mongoose')

    const schema = new mongoose.Schema({
    
        name:{
            type: String,
            required: true,
        
        },
        stock:{
            type:Number,
            required: true
        },
        price:{
            type:Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to Category model
            required: true,
        },
        imgArray: {
            type: [String], // Array of image paths
            required: true
        },

        description:{
            type: String,
            required: true,
        
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },{ timestamps:true });

    module.exports = mongoose.model("products",schema)