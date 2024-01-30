import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { messageAPI } from '../utils/UserRequest';

const messageAxiosIntercepter = () => {
    const { token} = useSelector((state) => state.home);
    console.log({token});
    const navigate = useNavigate();
    useEffect(() => {
      // Request interceptor
      const reqInterceptor = (config) => {
        // Modify request configuration, e.g., set headers
        config.headers['Authorization'] = token
        return config;
      };
  
      // Response interceptor
      const resInterceptor = (response) => response;
  
      // Error interceptor
      const errInterceptor = (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/Signin');
        }
        return Promise.reject(error);
      };
  
      const reqInterceptorId = messageAPI.interceptors.request.use(reqInterceptor);
      const resInterceptorId = messageAPI.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        messageAPI.interceptors.request.eject(reqInterceptorId);
        messageAPI.interceptors.response.eject(resInterceptorId);
      };
    }, [token, navigate]);
  
    return messageAPI
  };
  
  export default messageAPI;

export { messageAxiosIntercepter}