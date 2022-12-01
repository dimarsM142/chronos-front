import React, { useEffect, useState } from "react";

import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Error from "./pages/Error";
import Login from "./pages/Login";
import AllCalendars from "./pages/All-calendars";
import Navigation from "./components/Navigation.js";
import Footer from "./components/Footer.js";
import { privateRoutes, publicRoutes, adminRoutes } from "./router";
import PostService from "./API/PostService";
import { useFetching } from "./hooks/useFetching";
import ResetPassword from "./pages/Reset-password";
function App() {
    const [timerID, setTimerID] = useState('');
    const[auth, setAuth] = useState(localStorage.getItem('isAuth') === 'false' ? false : true);


    function clearRefresh(){
        if(timerID){
            clearInterval(timerID);
        }
    }
    function createRefresh(){
        let timerIdCurrent = setInterval(refreshToken, 60 * 50 * 1000);
        setTimerID(timerIdCurrent);
    }
    function refreshToken(){
        fetchRefresh();
    }
    useEffect(() =>{
        if(localStorage.getItem('isAuth') === 'true'){
            refreshToken();
        }
        else{
            setAuth(false);
        }
    }, []);
  
    const [fetchRefresh, , refreshError] = useFetching(async () => {
        const response = await PostService.refreshToken(localStorage.getItem('refresh'));
            if(response.data && response.data.accessToken){
                localStorage.setItem('access', response.data.accessToken);
                localStorage.setItem('refresh', response.data.refreshToken);
                localStorage.setItem('isAuth', 'true');
                //localStorage.setItem('role', response.data.role);
                setAuth(true);                
            }
        
    })
    useEffect(()=>{
        if(refreshError){
            setAuth(false);
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            localStorage.setItem('isAuth', 'false');
            window.localStorage.setItem('login', '');
            window.localStorage.setItem('ava', '');
            localStorage.setItem('role', '');
        }
    }, [refreshError]);

    return (
        <div className="App">
            
            <BrowserRouter>
            <Navigation auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>
            {auth
                ?
                <>
                    {localStorage.getItem('role') === 'admin'
                        ?
                        <Routes>
                            {adminRoutes.map(route =>
                                    <Route path={route.path} element={<route.element auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} key={route.path} />
                                )
                            }
                            <Route path="/" element={<Navigate to="/calendars" replace />} />
                            <Route path="/calendars" element={<AllCalendars auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} />
                            <Route path="/error" element={<Error refreshToken={createRefresh}/>} />
                            <Route path="*" element={<Navigate to="/error" replace />} />
                        </Routes>
                        :
                        <Routes>
                            {privateRoutes.map(route =>
                                    <Route path={route.path} element={<route.element auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} key={route.path} />
                                )
                            }
                            <Route path="/" element={<Navigate to="/calendars" replace />} />
                            <Route path="/calendars" element={<AllCalendars auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} />
                            <Route path="/error" element={<Error refreshToken={createRefresh}/>} />
                            <Route path="*" element={<Navigate to="/error" replace />} />
                        </Routes>
                    }
                </>
                :
                <Routes> 
                    {publicRoutes.map(route =>
                            <Route path={route.path} element={<route.element auth={auth} setAuth={setAuth} refreshToken={createRefresh}/>} key={route.path} />
                        )
                    }
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/error" element={<Error />} />
                    <Route path="/login" element={<Login auth={auth} setAuth={setAuth} refreshToken={createRefresh}/>} />
                    <Route path="/forgot-password/:token" element={<ResetPassword auth={auth} setAuth={setAuth} refreshToken={createRefresh}/>} />
                </Routes>
            }
           <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
