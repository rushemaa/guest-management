import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LeftNav from './Leftnav';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import EditGuest from '../pages/guest/EditGuest';

const handleBackBtn = () => {
  window.location.href = '/guests'
}

const Guest = () => {

  const [details, setDetails] = useState();
  const [current, setCurrent] = useState({})
  const [toggleGEdit, isGEditToggled] = useState(false)
  const [toggleCEdit, isCEditToggled] = useState(false)


  const { id } = useParams()
  useEffect(() => {
    getGuest()
  }, [])

  const getGuest = () => {
    axios.get(BASE_URL + `/guest/getGuest/${id}`).then(
      res => setDetails(res.data.data)
    ).catch(error => {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    });
  }

  const handleEdit = (type) => {
    setCurrent({ ...details })
    type === 'guest' ? isGEditToggled(true) : isCEditToggled(true)
  }

  console.log(details)


  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side px-5">
        <div className='flex gap-x-5 pt-20 flex-wrap items-center'>
          <button className='flex justify-center align-center rounded-full' onClick={handleBackBtn}>
            <ArrowBackRoundedIcon />
          </button>
          <h1 className='font-semibold text-2xl'>Guest information</h1>
          <div className='information flex items-center justify-end flex-row gap-x-7 grow text-center'>
            <CreateTwoToneIcon onClick={() => { handleEdit('guest') }} className='cursor-pointer hover:scale-110 hover:text-green-800' />
            <DeleteTwoToneIcon className='cursor-pointer hover:scale-110 hover:text-green-800' />
          </div>
        </div>
        <div className="list py-10 grid gap-10 grid-cols-3">
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Guest names</label>
            <span className='pl-2 text-gray-500'>{details?.guestFullName}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Id number</label>
            <span className='pl-2 text-gray-500'>{details?.guestIdNumber}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Phone number</label>
            <span className='pl-2 text-gray-500'>{details?.guestPhone}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>From</label>
            <span className='pl-2 text-gray-500'>{details?.comeFrom
            }</span>

            <span className='pl-2 text-gray-500'>{details?.comeFrom}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Date</label>
            <span className='pl-2 text-gray-500'>{details?.date}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Time</label>
            <span className='pl-2 text-gray-500'>{details?.time}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Receiver</label>
            <span className='pl-1 text-gray-500'>{details?.receiverFullName}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Receiver number</label>
            <span className='pl-1 text-gray-500'>{details?.receiverPhoneNumber}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Call sign</label>
            <span className='pl-1 text-gray-500'>{details?.Host?.callSign}</span>
            <label className='text-lg font-normal'>Host/Call sign</label>
            <span className='pl-1 text-gray-500'>{details?.Host?.hostName}/ {details?.Host?.callSign}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Gate</label>
            <span className='pl-1 text-gray-500'>{details?.Gate?.gate}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Condition</label>
            <span className='pl-1 text-gray-500'>{details?.conditions}</span>
          </div>
          <div className='information flex flex-col'>
            <label className='text-lg font-normal'>Status</label>
            <span className='pl-1 text-gray-500'>{details?.visitStatus}</span>
          </div>
        </div>

        {/* Entrance details */}
        <div className='flex gap-x-5 pt-2 items-center'>
          <h2 className='font-semibold text-xl'><u>Entrance information</u></h2>
        </div>
        {
          details?.Transports?.map((transport, i) =>
            <div className="list py-5 grid gap-x-10 gap-y-6 grid-cols-3 border-b border-gray-300">
              <div className='information flex flex-col'>
                <label className='text-lg font-normal'>{transport?.transportType}</label>
                <span className='text-gray-500'>Entrance mode</span>
              </div>
              <div></div>
              <div className='information flex items-center flex-row gap-x-7'>
                <CreateTwoToneIcon onClick={() => { handleEdit('car') }} className='cursor-pointer hover:scale-110 hover:text-green-800' />
                <DeleteTwoToneIcon className='cursor-pointer hover:scale-110 hover:text-green-800' />
              </div>
              {
                (transport?.plateNumber || transport?.vehicleModel || transport?.vehicleColour) &&
                <>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Car plate</label>
                    <span className='pl-1 text-gray-500'>{transport?.plateNumber}</span>
                  </div>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Car Model</label>
                    <span className='pl-1 text-gray-500'>{transport?.vehicleModel}</span>
                  </div>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Car color</label>
                    <span className='pl-1 text-gray-500 flex items-center'><div className={"w-[15px] h-[10px] rounded-full bg-" + transport?.vehicleColour.toLowerCase() + "-500"}></div> &nbsp; {transport?.vehicleColour}</span>
                  </div>
                </>
              }
              {
                (transport?.driverFullName || transport?.driverNationId || transport?.driverPhoneNumber) &&
                <>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Driver names</label>
                    <span className='pl-1 text-gray-500'>{transport?.driverFullName}</span>
                  </div>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Driver ID number</label>
                    <span className='pl-1 text-gray-500'>{transport?.driverNationId}</span>
                  </div>
                  <div className='information flex flex-col'>
                    <label className='text-lg font-normal'>Driver Contact</label>
                    <span className='pl-1 text-gray-500'>{transport?.driverPhoneNumber}</span>
                  </div>
                </>
              }
            </div>
          )
        }
        <EditGuest toggle={toggleGEdit} isToggled={isGEditToggled} data={current} postOp={getGuest} />
      </div>
    </div>
  )
}

export default Guest