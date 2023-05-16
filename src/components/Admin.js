import LeftNav from './Leftnav';

export default function Admin() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <h1>Admin side</h1>
      </div>
    </div>
  );
}
