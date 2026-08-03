import "./env.js"
import { connDB } from "../db/index.js";
import { app } from "./app.js";
import createDefaultAdmin from "../utils/createDefaultAdmin.js";

connDB()
.then(()=>{
  console.log("DB is Connected Successfully ")
  createDefaultAdmin()
  app.listen(process.env.PORT || 5000,()=>console.log(`Connected on the POrt ${process.env.PORT}`))
})
.catch((err)=>console.log("THere is been some Error while connecting the DB: ",err))

