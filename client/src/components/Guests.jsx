import LeftNav from './Leftnav';
import React from 'react';

export default function Guests() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <h1>Guests</h1>
      </div>
    </div>
  );
}
