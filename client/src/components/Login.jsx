import '../css/Login.css';
import Logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';


const Login = () =>  {

  const [state, setState] = useState();
  const [status, setStatus] = useState();
  const [loading, isLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async () => {
    isLoading(true)
    axios.post(`${BASE_URL}/login`)
      .then((res) => {
        isLoading(false)
        
      }).catch(error => {
        isLoading(false)
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

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
    setAccountState({ ...accountState, [name]: value });
  };
  return (
    <div className="login">
      <div className="l-side">
        <h1>GUEST MANAGEMENT SYSTEM</h1>
        <img alt="logo" src={Logo} />
      </div>
      <div className="r-side">
        <h2>LOGIN</h2>
        <p>Welcome back! It's good to have you here again.</p>
        <form>
          <input
            type="text"
            className="login-input"
            placeholder="Username or Email"
          />
          <input type="text" className="login-input" placeholder="Password" />
          <button>Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Login
