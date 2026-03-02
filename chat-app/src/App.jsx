import React from 'react'
import Auth from './pages/Auth'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './components/Register'
import Login from './components/Login'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='bg-red-400'>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <Routes>
           <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<Auth/>} />
 
   

      <Route path="/dashboard" element={<Dashboard/>} />

     
    </Routes>
    </div>
  )
}

export default App
