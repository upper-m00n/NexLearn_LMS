'use client';

import { createContext, useContext, useEffect, useState } from "react";

interface User{
    id:string;
    username:string;
    email:string;
    profilePic:string;
    role: 'STUDENT' | 'TRAINER' | 'ADMIN'
}

interface AuthContextType{
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser:(user: User| null)=> void;
    setToken:(token:string | null)=>void;
    logout:()=>void;
    loading:boolean
}

const AuthContext = createContext<AuthContextType| undefined>(undefined);

export const AuthProvider=({children}:{children:React.ReactNode})=>{
    const [user, setUser]= useState<User | null>(null);
    const [token, setToken]= useState<string | null>(null);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        const storedToken= localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    },[]);

    const logout=()=>{
        setToken(null);
        setUser(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return(
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user && !!token,
            setUser,
            setToken,
            logout,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    const context= useContext(AuthContext);
    if(!context) throw new Error('useAuth must be within AuthProvider')
    return context;
}