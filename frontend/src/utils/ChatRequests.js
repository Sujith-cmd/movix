import axios from 'axios';
const API= axios.create({baseURL: 'http://localhost:5000/api'})
export const userChats=(id)=> API.get(`/chat/${id}`)
export const findChats=(id)=> API.get(`/chat/${id}`)