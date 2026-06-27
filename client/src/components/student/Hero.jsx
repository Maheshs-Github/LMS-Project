import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const [search,setSearch]=useState("")
  const navigate=useNavigate();
  const handleExplore=()=>{
    navigate("/courses",{state:{searchValue:search}})
  }
  const handleSearchChange=(e)=>{
    setSearch(e.target.value);
  }
  return (
    <div className='w-full text-white bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 py-12 flex justify-center'>
      <div className='flex flex-col gap-6 items-center'>
      <h3 className='text-2xl font-semibold '>Find the Best Courses for You</h3>
      <p>Discover, learn and Upskill with our wide range of courses </p>
      <div className=''>
      <input  type="text" name='search' onChange={handleSearchChange}  value={search} className='outline-none p-1 bg-white text-black rounded-l-full pl-1 sm:w-96'/>
      <button className='bg-blue-500 text-white p-1 px-6  rounded-r-full cursor-pointer' onClick={handleExplore}>Search</button>
      </div>
      <button className='text-blue-500 bg-white p-1 px-6  rounded-full font-semibold cursor-pointer' onClick={handleExplore}>Explore Courses</button>
      </div>
    </div>
  )
}

export default Hero
