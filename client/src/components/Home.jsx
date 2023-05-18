import React from 'react';
import LeftNav from './Leftnav';
import SelectAllTwoToneIcon from '@mui/icons-material/SelectAllTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import DirectionsWalkTwoToneIcon from '@mui/icons-material/DirectionsWalkTwoTone';
import NoAccountsTwoToneIcon from '@mui/icons-material/NoAccountsTwoTone';

export default function Home() {
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <div className='flex justify-between items-center flex-wrap gap-y-5'>
          <div className='py-10'>
            <h1 className='font-semibold text-2xl leading-6'>Dashboard</h1>
            <label className='font-thin text-sm text-gray-500 leading-3 italic'>Information about our guest traffics</label>
          </div>
        </div>
        <div className='flex flex-wrap mt-10'>
          {/* card */}
          <div className='flex gap-2 min-w-[20%]'>
            <div className='bg-orange-100 p-3 rounded-2xl'><SelectAllTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-thin subpixel-antialiased'>All Guest</p>
              <p className='font-extralight subpixel-antialiased'>40</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[20%]'>
            <div className='bg-pink-100 text-green p-3 rounded-xl'><HowToRegTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>In Guest</p>
              <p className='font-extralight subpixel-antialiased'>10</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[20%]'>
            <div className='bg-green-100 p-3 rounded-xl'><MeetingRoomTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Out Guest</p>
              <p className='font-extralight subpixel-antialiased'>40</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[20%]'>
            <div className='bg-red-100 text-green p-3 rounded-xl'><DirectionsWalkTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Pending</p>
              <p className='font-extralight subpixel-antialiased'>10</p>
            </div>
          </div>

          {/* card */}
          <div className='flex gap-2 min-w-[20%]'>
            <div className='bg-violet-50 text-green p-3 rounded-xl'><NoAccountsTwoToneIcon color='success' /></div>
            <div className="details">
              <p className='italic text-gray-400 font-extralight subpixel-antialiased'>Cancelled guest</p>
              <p className='font-extralight subpixel-antialiased'>10</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
