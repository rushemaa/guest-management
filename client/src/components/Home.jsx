import React, { useState, useEffect } from 'react';
import LeftNav from './Leftnav';
import SelectAllTwoToneIcon from '@mui/icons-material/SelectAllTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import DirectionsWalkTwoToneIcon from '@mui/icons-material/DirectionsWalkTwoTone';
import NoAccountsTwoToneIcon from '@mui/icons-material/NoAccountsTwoTone';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Alert from './feedback/Alert';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get(BASE_URL + '/dashboard/dashStats')
    .then(res => {
      setData(res.data.data.flat());
    })
    .catch(error => {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    });
  }, []);

  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <Alert />
        <div className='flex justify-between items-center flex-wrap gap-y-5'>
          <div className='py-10'>
            <h1 className='font-semibold text-2xl leading-6'>Dashboard</h1>
            <label className='font-thin text-sm text-gray-500 leading-3 italic'>Information about our guest traffics</label>
          </div>
        </div>
        <div className='flex flex-wrap mt-10 gap-y-10'>
          {/* card */}
          <div className='flex gap-2 min-w-[200px] max-w-[20%] hover:cursor-pointer' onClick={()=>navigate('/guests/ALL')}>
            <div className='bg-orange-100 p-3 rounded-2xl'><SelectAllTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-thin subpixel-antialiased'>All Guest</p>
              <p className='font-extralight subpixel-antialiased'>{data.reduce((a, b) => a + b.Number , 0)}</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[200px] max-w-[20%] hover:cursor-pointer' >
            <div className='bg-pink-100 text-green p-3 rounded-xl'><HowToRegTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>In Guest</p>
              <p className='font-extralight subpixel-antialiased'>10</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[200px] max-w-[20%] hover:cursor-pointer'>
            <div className='bg-green-100 p-3 rounded-xl'><MeetingRoomTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Out Guest</p>
              <p className='font-extralight subpixel-antialiased'>40</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[200px] max-w-[20%] hover:cursor-pointer' onClick={()=>navigate('/guests/PENDING')}>
            <div className='bg-red-100 text-green p-3 rounded-xl'><DirectionsWalkTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Pending</p>
              <p className='font-extralight subpixel-antialiased'>{
                (data.find(d => d.Status === 'PENDING')?.Number) ? data.find(d => d.Status === 'PENDING')?.Number : 0
              }</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[200px] max-w-[20%] hover:cursor-pointer' onClick={()=>navigate('/guests/CANCELED')}>
            <div className='bg-violet-50 text-green p-3 rounded-xl'><NoAccountsTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Cancelled guest</p>
              <p className='font-extralight subpixel-antialiased'>{
                (data.find(d => d.Status === 'CANCELED')?.Number) ? data.find(d => d.Status === 'CANCELED')?.Number : 0
              }</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
