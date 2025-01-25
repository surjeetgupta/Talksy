import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdaatingProfile:false,
    isCheckingAuth:true,//for checking if the user is logged in or not
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data});
            get().connectSocket();
        }catch (error) {
            set({ authUser: null });
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async (formData) => {
        set({isSigningUp:true});
       try{
          const response=await axiosInstance.post("/auth/signup", formData);
          set({authUser:response.data});
          toast.success("signup successfull");
          get().connectSocket();
       }catch(error){
          toast.error("signup failed");
       }finally{
         set({isSigningUp:false});
       }
    },
    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null });
            toast.success("logout successful");
            get().disconnectSocket();
        } catch (error) {
            console.log(error);
            toast.error("logout failed");
        }
    },
    login: async (formData) => {
        set({isLoggingIn:true});
       try{
          const response=await axiosInstance.post("/auth/login", formData);
          set({authUser:response.data});
          toast.success("login successfull");
          get().connectSocket();
       }catch(error){
          toast.error("login failed");
       }finally{
         set({isLoggingIn:false});
       }
    },
    updateProfile: async (data) => {
        set({isUpdaatingProfile:true});
       try{
          const response=await axiosInstance.put("/auth/update-profile", data);
          set({authUser:response.data});
          toast.success("Profile updated successfull");
       }catch(error){
          toast.error("Profile update failed");
       }finally{
         set({isUpdaatingProfile:false});
       }
    },
    connectSocket: () => {
        const {authUser}=get();
        if(!authUser || get().socket?.connected){
            return; 
        }
        const socket=io(BASE_URL,
            {
                query:{
                    userId:authUser._id,
                },
            }
        );
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users });
        });
    },
    disconnectSocket: () => {
        if(get().socket?.connected){
            get().socket.disconnect();  
            set({socket:null});
        }
    },
}));