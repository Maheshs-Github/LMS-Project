import mongoose from "mongoose"


 const connDB=async()=>{
  //  console.log("URL: ",`${process.env.MONGO_URL}`)
   const ConnRes=await mongoose.connect(`${process.env.MONGO_URL}`);
  //  console.log("URL: ",`${process.env.MONGO_URL}`)
  //  console.log("ConnRes: ",ConnRes);

  
}

export {connDB}                       