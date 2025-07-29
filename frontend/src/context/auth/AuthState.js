// src/context/auth/AuthState.js

import React, { useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import api from '../../utils/api';

const AuthState = (props) => {
  // All hooks (like useReducer) MUST be called at the top level of the component,
  // every single time it renders. They cannot be inside conditions or loops.
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    initialized: false,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // --- Functions ---
  const loadUser = async () => {
    try {
      const res = await api.get('/auth');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error(errorMsg);
      dispatch({ type: 'REGISTER_FAIL', payload: errorMsg });
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Authentication failed';
      toast.error(errorMsg);
      dispatch({ type: 'LOGIN_FAIL', payload: errorMsg });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully.');
  };

  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        initialized: state.initialized,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;