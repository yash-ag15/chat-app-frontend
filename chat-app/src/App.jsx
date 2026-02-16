import React from 'react'
import Auth from './pages/Auth'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './components/Register'

const App = () => {
  return (
    <div className='bg-red-400'>
    <Routes>
      <Route path="/login" element={<Auth/>} />
      <Route path="/register" element={<Register/>} />

      <Route path="/dashboard" element={<Dashboard/>} />

     
    </Routes>
    </div>
  )
}

export default App
