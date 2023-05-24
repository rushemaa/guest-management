import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/Left-nav.css';
import DehazeRoundedIcon from '@mui/icons-material/DehazeRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { logout } from '../service/reducers/AuthSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function LeftNav() {


  const dispatch = useDispatch()
  const auth = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_APP_AUTH));
  const navigate = useNavigate()
  const [links, setLinks] = useState([])

  const navLinks = [
    { url: '/home', ref: 'dashboard', icon: <DashboardIcon className="icons" />, privacy: 'semi-private' },
    { url: '/add-guest', ref: 'Add guest', icon: <GroupAddIcon className="icons" />, privacy: 'semi-private' },
    { url: '/guests/PENDING', ref: 'View guests', icon: <FormatListBulletedIcon className="icons" />, privacy: 'public' },
    { url: '/admin', ref: 'Admin', icon: <SettingsApplicationsIcon className="icons" />, privacy: 'private' },
  ]


  useEffect(() => {
    if (auth === null) {
      navigate('/')
    } {
      if (auth?.user?.role === 'GATE')
        setLinks([...navLinks.filter(item => item.privacy === 'public')])
      else if (auth?.user?.role === 'HOST' || auth?.user?.role === 'SECURITY OFFICER')
        setLinks([...navLinks.filter(item => item.privacy === 'public' || item.privacy === 'semi-private')])
      else
        setLinks([...navLinks])
    }
  }, [])

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate('/');
    } catch (error) {
      dispatch(setMessage({ type: 'error', message: error }))

    }
  };
  return (
    <>
      <div className="user-info">
        <div className="user-logo">
          <AccountCircleIcon style={{ color: '#fff' }} sx={{ fontSize: 100 }} />
        </div>
        <div className="toggle-icon" tabIndex={0}>
          <DehazeRoundedIcon style={{ color: '#fff' }} sx={{ fontSize: 30 }} />
        </div>
        <div className="u-info">
          <h3>{auth?.user?.fullName}</h3>
          <h4>{auth?.user?.role}</h4>
        </div>
      </div>

      <ul className="nav-links">
        {links?.map((item, key) => (
          <li key={key}>
            <a href={item.url}>
              <div className="icon">
                {item.icon}
              </div>
              <h4 className="nav-name">{item.ref}</h4>
            </a>
          </li>
        ))}
        <li onClick={() => handleLogout()}>
          <a href="#">
            <div className="icon">
              <LogoutIcon className="icons" />
            </div>
            <h4 className="nav-name">Logout</h4>
          </a>
        </li>
      </ul>
    </>
  );
}
