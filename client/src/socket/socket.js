import { io } from "socket.io-client";


const socket=io(import.meta.env.VITE_BASE_BACKEND_URL,{withCredentials:true})
// const socket=io(`http://localhost:8000`)

socket.emit("hello","konnichiwa Frontend desu, yorishiku");

socket.on("hello2",(data)=>{
  console.log("Message from backend is a: ",data);
})

socket.emit("hello3")
socket.on("roomMessage",(data)=>console.log("data: ",data))

socket.on("userRoomMessage",(data)=>{
  console.log("UserRoom data: ",data)
})
socket.emit("testRoom")

export default socket;