import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AddGuest from './components/Add-guest';
import Login from './components/Login';
import './css/App.css';
import Home from './components/Home';
import Guests from './components/Guests';
import Admin from './components/Admin';

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-guest" element={<AddGuest />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
