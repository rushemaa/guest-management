import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/Left-nav.css';
import DehazeRoundedIcon from '@mui/icons-material/DehazeRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export default function LeftNav() {
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
          <h3>Kabera Joe</h3>
          <h4>Manager</h4>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <a href="home">
            <div className="icon">
              <DashboardIcon className="icons" />
            </div>
            <h4 className="nav-name">Dashboard</h4>
          </a>
        </li>
        <li>
          <a href="add-guest">
            <div className="icon">
              <GroupAddIcon className="icons" />
            </div>
            <h4 className="nav-name">Add Guest</h4>
          </a>
        </li>
        <li>
          <a href="guests">
            <div className="icon">
              <FormatListBulletedIcon className="icons" />
            </div>
            <h4 className="nav-name">View Guest</h4>
          </a>
        </li>
        <li>
          <a href="admin">
            <div className="icon">
              <SettingsApplicationsIcon className="icons" />
            </div>
            <h4 className="nav-name">Admin</h4>
          </a>
        </li>
        <li>
          <a href="/">
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
