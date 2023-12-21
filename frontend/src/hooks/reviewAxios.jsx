import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reviewAPI } from '../utils/UserRequest';
const reviewAxiosIntercepter = () => {
    const { token} = useSelector((state) => state.home);
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
          navigate('/userSignin');
        }
        return Promise.reject(error);
      };
  
      const reqInterceptorId = reviewAPI.interceptors.request.use(reqInterceptor);
      const resInterceptorId = reviewAPI.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        reviewAPI.interceptors.request.eject(reqInterceptorId);
        reviewAPI.interceptors.response.eject(resInterceptorId);
      };
    }, []);
  
    return reviewAPI
  };
  
  export default reviewAPI;

export { reviewAxiosIntercepter}