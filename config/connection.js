const mongoose=require('mongoose')

const connectDB=async()=>{
try{
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
console.log("mongoDB connected");
console.log("njf");

}catch(error){
    console.log('error while connecting mongodb',error.message);
}
}

module.exports= connectDB