import { create } from "zustand";
import axios from "axios";
// import { signup } from "../../../backend/controller/userController";

const API_URL = "http://localhost:4000/api/v3";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: false,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });

      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });

      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgetPassword: async(email)=>{
    set({isLoading: true, error:null});

    try {
      const response = await axios.post(`${API_URL}/forget`, {email});
      set({message: response.data.message ,isLoading:false});
    } catch (error) {
      set({isLoading: false , 
        error:error.response.data.message || "Error sending reset password email"
      });
      throw error;      
    }
  }, 
  resetPassword: async(token ,password)=>{
    set({isLoading:true , error:null});
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {password});
      set({message :response.data.message , isLoading : false});
    } catch (error) {
      set({isLoading: false , 
        error:error.response.data.message || "Error password email"
      });
      throw error;
    }
  }
}));
