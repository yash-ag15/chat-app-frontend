import React from 'react'
import Auth from './pages/Auth'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const hasToken = () => Boolean(localStorage.getItem('token'));

const PublicRoute = ({ children }) => {
  return hasToken() ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  return hasToken() ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <div className='bg-red-400'>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
 
 

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/chat/:chatId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

     
    </Routes>
    </div>
  )
}

export default App
