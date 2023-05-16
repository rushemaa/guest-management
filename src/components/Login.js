import '../css/Login.css';
import Logo from '../assets/logo.png';

export default function Login() {
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
