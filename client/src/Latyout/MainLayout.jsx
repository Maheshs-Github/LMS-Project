import Home from '@/pages/Home'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
            <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default MainLayout
