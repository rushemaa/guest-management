import '../css/Login.css';
import Logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Alert from './feedback/Alert';
import { getAuthError, getAuthState, getAuthStatus, login } from '../service/reducers/AuthSlice';
import SubmitButton from './buttons/SubmitButton';
import NButton from './buttons/NButton';
import { setMessage } from '../service/reducers/AlertSlice';


const Login = () => {

  const [state, setState] = useState();
  const [loading, isLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_APP_AUTH));

  const status = useSelector(getAuthStatus);
  const authState = useSelector(getAuthState)
  const error = useSelector(getAuthError)

  const handleLogin = () => {
    dispatch(login(state))
  }

  useEffect(() => {
    if (authState === "failed") {
      dispatch(setMessage({ type: "error", message: error }))
    }
  }, [authState]);

  useEffect(() => {
    if (status) {
      if (!(auth.user.role === "GATE")) {
        navigate("/home");
      } 
      else {
        navigate("/guests/PENDING");
      }
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="login flex gap-10">
      <Alert />
      <div className="l-side h-[100svh] flex justify-center items-center">
        <h1>GUEST MANAGEMENT SYSTEM</h1>
        <img alt="logo" src={Logo} />
      </div>
      <div className="r-side h-[100svh] flex justify-center">
        <h2>LOGIN</h2>
        <p>Welcome back! It's good to have you here again.</p>
        <form className='w-full'>
          <input
            type="text"
            name="username"
            onChange={(e) => {
              handleChange(e);
            }}
            className="login-input"
            placeholder="Username"
          />
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <NButton value={'Sign in'} onsubmit={'Signing in...'} status={authState === "loggingIn..."} onclick={handleLogin} />
        </form>
      </div>
    </div>
  );
}

export default Login
