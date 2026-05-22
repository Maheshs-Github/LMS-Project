import Navbar from '@/components/Navbar';
import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const user=useSelector((state)=>state.auth.user);
  return (
    <div>
      <Navbar />
      <h2>Hello in a Home </h2>
    </div>
  )
}

export default Home
