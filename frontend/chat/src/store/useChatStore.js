import { create } from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import { use } from "react";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get) => ({
    messages: [],
    users:[],
    selectedUser:null,
    isUsersLoading:false, 
    isMessagesLoading:false,

    getUsers: async () => {
        set({isUsersLoading:true});
        try{
            const response=await axiosInstance.get("/message/user");
            set({users:response.data});
        }catch(error){
            console.log(error);
            toast.error("Failed to fetch users");
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try{
            const response=await axiosInstance.get(`/message/${userId}`);
            set({messages:response.data});
        }catch(error){
            console.log(error);
            toast.error("Failed to fetch messages");
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async (data) => {
        const {selectedUser,messages}=get();

        try{
            const response=await axiosInstance.post(`/message/send/${selectedUser._id}`,data);
            set({messages:[...messages,response.data]});
        }catch(error){
            console.log(error);
            toast.error("Failed to send message");
        }

    },
    subscribeToMessages: (userId) => {
        const {selectedUser}=get();
        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;
        socket.on("newMessage", (message) => {
            if(message.senderId !==selectedUser._id) return;
            set({messages:[...get().messages,message]})
        });
    },
    unsubscribeFromMessages: (userId) => {
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({selectedUser:user}),
}));
