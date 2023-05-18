import React from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LeftNav from './Leftnav';

const handleBackBtn = () => {
  window.location.href='/guests'
}

const Guest = () => {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side px-5">
        <div className='flex gap-x-5 pt-20 items-center'>
          <button className='flex justify-center align-center rounded-full' onClick={handleBackBtn}>
            <ArrowBackRoundedIcon />
          </button>
          <h1 className='font-semibold text-2xl'>Guest information</h1>
        </div>
        <div className="list py-10 grid gap-10 grid-cols-3">
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Guest names</label>
            <span className='pl-2 text-gray-500'>Muhire Philippe</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Id number</label>
            <span className='pl-2 text-gray-500'>111111111111111111111</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Phone number</label>
            <span className='pl-2 text-gray-500'>078847378789</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>From</label>
            <span className='pl-2 text-gray-500'>RDB</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Date</label>
            <span className='pl-2 text-gray-500'>20 sept 2022</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Time</label>
            <span className='pl-2 text-gray-500'>16:00 PM</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Receiver</label>
            <span className='pl-1 text-gray-500'>Mihigo Yves</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Receiver number</label>
            <span className='pl-1 text-gray-500'>078743674367</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Call sign</label>
            <span className='pl-1 text-gray-500'>*1234</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Gate</label>
            <span className='pl-1 text-gray-500'>Gate 1</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Condition</label>
            <span className='pl-1 text-gray-500'>condition 1</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Status</label>
            <span className='pl-1 text-gray-500'>
              <select><option>status</option><option>Postponed</option><option>Cancel</option></select>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Guest