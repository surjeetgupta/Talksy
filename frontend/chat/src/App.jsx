import { useEffect, useState } from 'react'
import { Navbar} from './components/Navbar';


import {Routes,Route, Navigate} from "react-router-dom";
import { Home } from './pages/Home';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { SettingPage } from './pages/SettingPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
function App() {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  const {theme, setTheme} = useThemeStore();
  console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

   if(isCheckingAuth && !authUser) {
     return (
        <div className='flex justify-center items-center h-screen'> 
          <Loader className='size-10 animate-spin'/>
        </div>
     )
   }
  
  return (
    <div className='mt-4' data-theme={theme}>
            <Navbar/>
            <Routes>
                <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/>}></Route>
                <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/>}></Route>
                <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}></Route>
                <Route path="/settings" element={<SettingPage/>}></Route>
                <Route path="/profile" element={authUser ?<ProfilePage/> :<Navigate to="/login"/>}></Route>
            </Routes>
            <Toaster/>
        
    </div>
  )
}

export default App
