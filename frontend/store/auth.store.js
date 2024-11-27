// const {create} = require('zustand');
// const axios = require('axios');
import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
const useauthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:3000/user/auth/signup", { email, password, name });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });

        } catch (error) {
            set({ error: error.response.data.message || "Error sigining up", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:3000/user/auth/verifyemail", { code });
            set({ isLoading: false, user: response.data.user, isAuthenticated: true });
            return response.data
        } catch (error) {
            set({ error: error.response.data.message || "Error verifing email", isLoading: false });
            throw error;
        }
    },

    signin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:3000/user/auth/signin", { email, password });
            set({ isLoading: false, user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error, Try Again", isLoading: false });
            throw error;
        }


    },

    signout: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:3000/user/auth/signout");
            set({ isLoading: false, user: null, isAuthenticated: false });
        } catch (error) {
            console.log(error.message);
        }



    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get("http://localhost:3000/user/auth/check-auth")
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false })
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("http://localhost:3000/user/auth/forgot-password", { email });
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            set({ error: error.response.data.message || "Error, Try Again" });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null })
        try {

            const response = await axios.post(`http://localhost:3000/user/auth/reset-password/${token}`, { password });
            set({ isLoading: false, })

        } catch (error) {
            set({ isLoading: false });
            set({ error: error.response.data.message || "Error, Try Again" });
            throw error;
        }
    }
}))

export default useauthStore;