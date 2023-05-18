import LeftNav from './Leftnav';
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export default function Guests() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <div className='flex justify-between items-center flex-wrap gap-y-5'>
          <div className=''>
            <h1 className='font-semibold text-2xl leading-6'>Guests</h1>
            <label className='font-thin text-sm text-gray-500 leading-3'>We are hosting 22 guests</label>
          </div>
          <div className='flex items-center gap-x-10 gap-y-0 flex-wrap'>
            <div className='flex flex-nowrap gap-2'><label>From:</label> <input type='date' className='px-2' /></div>
            <div className='flex flex-nowrap gap-2'><label>To:</label> <input type='date' className='px-2' /></div>
          </div>
          <div>
            <input type='search' placeholder='search for guest' className='p-2 bg-gray-100 rounded-md' style={{width: '300px', boxShadow: '0 0 2px black'}} />
          </div>
        </div>
        <div className="list py-10">
          <table className='w-full report-table'>
            <tr><th>#</th><th>Guest Names</th><th>Receiver</th><th>From</th><th>Date/Time</th><th>Actions</th></tr>
            <tr><td>1</td><td>MUHIRE Jean Philipe</td><td>MIHIGO Yves</td><td>RMSoft</td><td>2023 may, 20</td><td>Actions</td></tr>
            <tr><td>1</td><td>MUHIRE Jean Philipe</td><td>MIHIGO Yves</td><td>RMSoft</td><td>2023 may, 30</td><td>Actions</td></tr>

            <tr><td colSpan={6} className='text-right'>Total: 2</td></tr>
          </table>
        </div>
      </div>
    </div>
  );
}
