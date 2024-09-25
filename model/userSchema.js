const mongoose=require('mongoose')
const addressSchema=require('../model/addressSchema')

const schema=new mongoose.Schema({
    name:{  
      type:String,
      required:true
    },
    phone:{
        type:Number
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    address:{
        type:[addressSchema],
        default:[]
      },
    isActive:{       //whether the user is active
      type:Boolean,
      default:true  // By making a user's account active automatically
    },
    isBlocked:{
      type:Boolean,
      default:false
    }
    
})

module.exports=mongoose.model('echoemporium2',schema)