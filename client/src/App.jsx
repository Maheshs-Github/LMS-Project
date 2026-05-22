
import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/LoginSignUp'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
            <Toaster
        position="top-center"
        containerStyle={{
          margin: "60px", // or padding: '40px'
        }}
        // reverseOrder={false}
      />
      {/* <h1 className='text-cyan-400 font-bold bg-amber-800'>Hello There , this is a LMS Projcet</h1>
      <Button>Let's go damn 🕊️</Button> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App
