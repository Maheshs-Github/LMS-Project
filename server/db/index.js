import mongoose from "mongoose"


 const connDB=async()=>{
   const ConnRes=await mongoose.connect(`${process.env.MONGO_URL}`);

  
}

export {connDB}                       