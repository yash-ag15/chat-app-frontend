import React from 'react'
import Auth from './pages/Auth'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div className='bg-red-400'>
    <Routes>
      <Route path="/auth" element={<Auth/>} />
      <Route path="/dashboard" element={<Dashboard/>} />

     
    </Routes>
    </div>
  )
}

export default App
