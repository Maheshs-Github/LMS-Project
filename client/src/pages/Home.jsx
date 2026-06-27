import Navbar from '@/components/Navbar';
import React from 'react'
import { useSelector } from 'react-redux'
import Hero from '../components/student/Hero';
import Courses from '@/components/student/Courses';

const Home = () => {
  const user=useSelector((state)=>state.auth.user);
  return (
    <div>
      <Navbar />
      <Hero />
      <Courses isShow={false}/>
    </div>
  )
}

export default Home
