import AddGuest from './components/Add-guest';
import LeftNav from './components/Leftnav';
import './css/App.css';

function App() {
  return (
    <div className="App">
      <LeftNav />
      <div className="right-side">
        <AddGuest />
      </div>
    </div>
  );
}

export default App;
