// src/pages/Login.js

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/auth/authContext';

const Login = () => {
  const { login, error, clearErrors, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: '', password: '' });
  const { email, password } = user;

  useEffect(() => {
    // If user is already authenticated, redirect to homepage
    if (isAuthenticated) {
      navigate('/');
    }
    // Clear any errors from previous pages
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error, navigate]);

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast.error('Please fill in all fields');
      return;
    }
    login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* You can replace this with your app's logo */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Zenith
          </h1>
          <p className="mt-2 text-gray-600">Welcome back! Sign in to continue.</p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={onChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
