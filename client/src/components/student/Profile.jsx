import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Frieren from "../../assets/FrierenSama.jpg"
import { useSelector } from 'react-redux'

const Profile = () => {
  const user=useSelector((state)=>state.auth.user);
  console.log("User: ",user);
  return (
    <div className='p-8'>
      <div className='flex flex-col w-full items-center gap-6'>
        <h1 className='font-bold text-3xl'>PROFILE</h1>
<Avatar className="w-20 h-20">
  <AvatarImage
    src={Frieren}
    className="object-cover"
  />
</Avatar>
<div className='flex flex-col items-start'>
<div className='text-black font-medium'>Name: <span className='text-gray-700'>Mahesh Mane</span></div>
<div className='text-black font-medium'>Email: <span className='text-gray-700'>mahesh@gmail.com</span></div>
<div className='text-black font-medium'>Role: <span className='text-gray-700'>Student</span></div>
</div>
<button className='text-white bg-black rounded p-2'>Edit Profile</button>
</div>    
    </div>
  )
}

export default Profile
