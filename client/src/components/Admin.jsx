import LeftNav from './Leftnav';
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function Admin() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl'>System Users</h1>
          <button className='flex justify-center align-center'>
            <AddCircleIcon/> &nbsp; Add User
          </button>
        </div>
        <div className="list py-10">
          <table className='w-full report-table'>
            <tr><th>#</th><th>Names</th><th>Instutition</th><th>Role</th><th>Action</th></tr>
            <tr><td>1</td><td>MUHIRE Jean Philipe</td><td>NISS</td><td>Hoster</td><td>Actions</td></tr>
            <tr><td>1</td><td>MUHIRE Jean Philipe</td><td>NISS</td><td>Hoster</td><td>Actions</td></tr>

            <tr><td colSpan={5} className='text-right'>Total: 2</td></tr>
          </table>
        </div>
      </div>
    </div>
  );
}
