import React, { useState, useEffect } from 'react';
import LeftNav from './Leftnav';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import Alert from './feedback/Alert';


export default function Guests() {

  const [guests, setGuests] = useState([]);
  const [filterRes, setFilterRes] = useState([])
  const [dateFilter, setDateFilter] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setDateFilter({ ...dateFilter, [name]: value })
  }

  useEffect(() => {
    getDataInDateInterval(guests, new Date(dateFilter?.from ?? new Date('1970-01-01')), new Date(dateFilter?.to ?? new Date('2023-10-10')))
  }, [dateFilter])


  const getDataInDateInterval = (data, startDate, endDate) => {
    console.log(`start date is ${startDate}, end date is ${endDate}`);
    const result = data?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    })
    console.log([...result])
    setGuests([...result])
  }

  const getGuests = async (page) => {
    axios.get(BASE_URL + `/guest/findAll/visitStatus/ALL/page/${page}`)
      .then(res => {
        setGuests([...res.data.data])
      })
      .catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  useEffect(() => {
    if (guests.length) {
      setFilterRes([...guests])
    }
  }, [guests])

  const handleSearch = (value) => {
    value !== '' ?
      setFilterRes([...guests.filter(x => x.guestFullName.toLowerCase().includes(value.toLowerCase()))])
      :
      setFilterRes([...guests])
  }



  useEffect(() => {
    getGuests(1)
  }, [])




  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <Alert/>
        <div className='flex justify-between items-center flex-wrap gap-y-5'>
          <div className=''>
            <h1 className='font-semibold text-2xl leading-6'>Guests</h1>
            <label className='font-thin text-sm text-gray-500 leading-3'>We are hosting {filterRes?.length} guests</label>
          </div>
          <div className='flex items-center gap-x-10 gap-y-0 flex-wrap'>
            <div className='flex flex-nowrap gap-2'><label>From:</label> <input type='date' name='from' onChange={handleChange} className='px-2' /></div>
            <div className='flex flex-nowrap gap-2'><label>To:</label> <input type='date' name='to' onChange={handleChange} className='px-2' /></div>
          </div>
          <div>
            <input type='search' onChange={(e) => { handleSearch(e.target.value) }} placeholder='search for guest' className='p-2 bg-gray-100 rounded-md' style={{ width: '300px', boxShadow: '0 0 2px black' }} />
          </div>
        </div>
        <div className="list py-10">
          <table className='w-full report-table'>
            <tr><th>#</th><th>Guest Names</th><th>Receiver</th><th>From</th><th>Date/Time</th><th>Actions</th></tr>
            {filterRes?.map((guest, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{guest.guestFullName}</td>
                <td>{guest.receiverFullName}</td>
                <td>{guest.comeFrom}</td>
                <td>{guest.date} {guest.time}</td>
                <td>
                  <PreviewTwoToneIcon onClick={() => location.href = `guest/${guest.randomReference}`} />
                </td></tr>
            ))}

            <tr><td colSpan={6} className='text-right'>Total: {filterRes
              ?.length}</td></tr>
          </table>
        </div>
      </div>
    </div>
  );
}
