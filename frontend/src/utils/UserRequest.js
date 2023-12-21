import axios from 'axios';
const API= axios.create({baseURL: 'http://localhost:5000/api'})
export const getUser=(id)=> API.get(`/users/${id}`)
export const getTheatre=(id)=> API.get(`/vendors/getDetails/${id}`)
export const chatCheck=(fId,sId)=> API.get(`/chat/find/${fId}/${sId}`)
export const createChat=(data)=> API.post(`/chat/`,data)


export const userAPI= axios.create({baseURL: 'http://localhost:5000/api/users'})
export const vendorAPI= axios.create({baseURL: 'http://localhost:5000/api/vendors'})
export const adminAPI= axios.create({baseURL: 'http://localhost:5000/api/admin'})
export const chatAPI= axios.create({baseURL: 'http://localhost:5000/api/chat'})
export const messageAPI= axios.create({baseURL: 'http://localhost:5000/api/message'})
export const reviewAPI= axios.create({baseURL: 'http://localhost:5000/api/review'})
