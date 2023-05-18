import React from 'react';
import { IconContext } from 'react-icons';
import { ImSpinner6 } from "react-icons/im";

function Loader() {
  return (
    <div role='status' className='my- animate-spin'>
      <IconContext.Provider value={{ size: '1.5em', color: '#005d55' }}>
        <ImSpinner6 />
      </IconContext.Provider>
      <span className='sr-only'>Loading...</span>
    </div>
  );
}

export default Loader;
