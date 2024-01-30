import axios from 'axios';
import { messageAxiosIntercepter } from '../hooks/messageAxios';
const API= axios.create({baseURL: 'http://localhost:5000/api'})
// const msgApi=messageAxiosIntercepter()


export const getMessages=(id)=> API.get(`/message/${id}`)
export const addMessage=(data)=> API.post(`/message/`,data)
// export const addMessage=(data)=> API.post(`/message/`,data)