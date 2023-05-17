import '../css/Login.css';
import Logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Alert from './feedback/Alert';
import { getAuthError, getAuthState, getAuthStatus, login } from '../service/reducers/AuthSlice';
import SubmitButton from './buttons/SubmitButton';


const Login = () => {

  const [state, setState] = useState();
  const [loading, isLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(getAuthStatus);
  const authState = useSelector(getAuthState)
  const error = useSelector(getAuthError)

  const handleLogin = () => {
    dispatch(login(state));
  }

  useEffect(() => {
    if (authState === "failed") {
      dispatch(setMessage({ type: "error", message: error }))
    }
  }, [authState]);

  useEffect(() => {
    if (status) {
      if (auth.user.Role === "ADMIN") {
        navigate("/home");
      } else {
        navigate("/");
      }
    }
  }, [status]);

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    setState({ ...accountState, [name]: value });
  };
  return (
    <div className="login">
      <Alert />
      <div className="l-side">
        <h1>GUEST MANAGEMENT SYSTEM</h1>
        <img alt="logo" src={Logo} />
      </div>
      <div className="r-side">
        <h2>LOGIN</h2>
        <p>Welcome back! It's good to have you here again.</p>
        <form onSubmit={()=>{handleLogin()}}>
          <input
            type="text"
            name="email"
            onChange={(e) => {
              handleChange(e);
            }}
            className="login-input"
            placeholder="Username or Email"
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
          <SubmitButton value={'Sign in'} onsubmit={'Signing in...'} status={status} />
        </form>
      </div>
    </div>
  );
}

export default Login
