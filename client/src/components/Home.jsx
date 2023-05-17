import LeftNav from './Leftnav';

export default function Home() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}
