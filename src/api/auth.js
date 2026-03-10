import { api } from "./index.js";

export const registerUser = (data)=>api.post('/user/register',data)
export const loginUser = (data)=>api.post('/user/login',data)
export const getCurrentUser = ()=>api.get('/user/current-user')
export const logoutUser = ()=>api.post('/user/logout')