import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vendorAPI } from '../utils/UserRequest';

const vendorAxiosIntercepter = () => {
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
          navigate('/vendorSignIn');
        }
        return Promise.reject(error);
      };
  
      const reqInterceptorId = vendorAPI.interceptors.request.use(reqInterceptor);
      const resInterceptorId = vendorAPI.interceptors.response.use(resInterceptor, errInterceptor);
  
      // Clean up interceptors on component unmount
      return () => {
        vendorAPI.interceptors.request.eject(reqInterceptorId);
        vendorAPI.interceptors.response.eject(resInterceptorId);
      };
    }, []);
  
    return vendorAPI
  };
  
  export default vendorAPI;

export { vendorAxiosIntercepter}