import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LeftNav from './Leftnav';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useDispatch } from 'react-redux';
import { setMessage } from '../service/reducers/AlertSlice';
import Alert from './feedback/Alert';
import EditGuest from '../pages/guest/EditGuest';
import TransportCU from '../pages/guest/TransportCU';


const Guest = () => {
  
  const [details, setDetails] = useState();
  const [current, setCurrent] = useState({})
  const [toggleGEdit, isGEditToggled] = useState(false)
  const [toggleCEdit, isCEditToggled] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_APP_AUTH))?.user?.role;
  
  const handleBackBtn = () => {
    navigate('/guests');
  }

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

  const handleGuestDelete = () => {
    axios.delete(BASE_URL + `/guest/delete/${id}`).then(
      res => {
        dispatch(setMessage({ type: 'success', message: res.data.message }));
        setTimeout(() => navigate("/guests"), 1000);
      }
    ).catch(error => {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    });
  }

  const handleTransportDelete = (id) => {
    axios.delete(BASE_URL + `/guest/deleteTransport/${id}`).then(
      res => {
        dispatch(setMessage({ type: 'success', message: res.data.message }));
      }
    ).catch(error => {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    });
  }

  const handleVisitStatusChange = (e) => {
    const data = {
      randomReference: id,
      visitStatus: e.target.value
    }
    axios.put(BASE_URL + '/guest/updateVisitStatus', data).then(res => {
      if (res.status === 200)
        dispatch(setMessage({ type: 'success', message: res.data.message }));
    }).catch(error => {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    });
  }

  const handleEdit = (type, data) => {
    setCurrent({ ...data })
    type === 'guest' ? isGEditToggled(true) : isCEditToggled(true)
  }

  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side px-5">
        <Alert />
        <div className='flex gap-x-5 pt-20 flex-wrap items-center'>
          <button className='flex justify-center align-center rounded-full hover:bg-main-color-onhover transition-all duration-300' onClick={handleBackBtn}>
            <ArrowBackRoundedIcon />
          </button>
          <h1 className='font-semibold text-2xl'>Guest information</h1>
          {(userType !== 'GATE') && <div className='information flex items-center justify-end flex-row gap-x-7 grow text-center'>
            <CreateTwoToneIcon onClick={() => { handleEdit('guest', details) }} className='cursor-pointer hover:scale-110 hover:text-green-800' />
            <DeleteTwoToneIcon className='cursor-pointer hover:scale-110 text-red-800 hover:text-green-800' onClick={handleGuestDelete} />
          </div>}
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
            {/* <span className='pl-1 text-gray-500'>{details?.visitStatus}</span> */}
            <span className='text-gray-500'>
              <select onChange={handleVisitStatusChange}>
                <option value="PENDING" selected={details?.visitStatus === "PENDING" ? "true" : "false"}>Pending</option>
                <option value="VISITED" selected={details?.visitStatus === "VISITED" ? "true" : "false"}>Visited</option>
              </select>
            </span>
          </div>
        </div>

        {/* Entrance details */}
        <div className='flex gap-x-5 pt-2 items-center justify-between'>
          <h2 className='font-semibold text-xl'><u>Entrance information</u></h2>
          {(userType !== 'GATE') && <button className='hover:bg-main-color-onhover transition-all duration-300' onClick={() => { isCEditToggled(true) }}><AddCircleTwoToneIcon /> &nbsp; Add Car</button>}
        </div>
        {
          details?.Transports?.map((transport, i) =>
            <div key={i} className="list py-5 grid gap-x-10 gap-y-6 grid-cols-3 border-b border-gray-300">
              <div className='information flex flex-col'>
                <label className='text-lg font-normal'>{transport?.transportType}</label>
                <span className='text-gray-500'>Entrance mode</span>
              </div>
              <div></div>
                <div className='information flex items-center flex-row gap-x-7'>
                  {
                    (userType !== 'GATE') && <><CreateTwoToneIcon onClick={() => { handleEdit('car', transport) }} className='cursor-pointer hover:scale-110 hover:text-green-800' />
                    <DeleteTwoToneIcon className='cursor-pointer hover:scale-110 text-red-800 hover:text-green-800' onClick={() => handleTransportDelete(transport?.id)} />
                    </>
                  }
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
                    <span className='pl-1 text-gray-500 flex items-center'><div className={"w-[15px] h-[10px] rounded-full bg-" + transport?.vehicleColour?.toLowerCase() + "-500"}></div> &nbsp; {transport?.vehicleColour}</span>
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
        <TransportCU toggle={toggleCEdit} isToggled={isCEditToggled} data={current} postOp={getGuest} id={id} />
      </div>
    </div>
  )
}

export default Guest