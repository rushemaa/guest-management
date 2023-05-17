import LeftNav from './Leftnav';
import React from 'react';

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
