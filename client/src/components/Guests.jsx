import React, { useState, useEffect } from 'react';
import LeftNav from './Leftnav';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import { useDispatch } from 'react-redux';
import { setMessage } from '../service/reducers/AlertSlice';
import Alert from './feedback/Alert';
import { useParams } from 'react-router-dom';


export default function Guests() {

  const [guests, setGuests] = useState([]);
  const [filterRes, setFilterRes] = useState([]);
  const [dateFilter, setDateFilter] = useState({});
  const [visitStatus, setVisitorStatus] = useState("");
  const dispatch = useDispatch();
  const { status } = useParams()

  useEffect(() => {
    setVisitorStatus(status)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDateFilter({ ...dateFilter, [name]: value })
  }

  useEffect(() => {
    if (!dateFilter?.to)
      getFrom(guests, new Date(dateFilter?.from ?? new Date('1970-01-01')))
    else
      getDataInDateInterval(guests, new Date(dateFilter?.from ?? new Date('1970-01-01')), new Date(dateFilter?.to ? dateFilter?.to : new Date()))
  }, [dateFilter])


  const getDataInDateInterval = (data, startDate, endDate) => {
    setFilterRes([...data?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getTime() >= startDate.getTime() && itemDate.getTime() <= endDate.getTime();
    })])
  }

  const getFrom = (data, startDate) => {
    setFilterRes([...data?.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getTime() >= startDate.getTime();
    })])
  }

  const getGuests = async (page) => {
    axios.get(BASE_URL + `/guest/findAll/visitStatus/${visitStatus ? visitStatus : status}/page/${page}`)
      .then(res => {
        setGuests([...res.data.data])
        setFilterRes([...res.data.data])
      })
      .catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  const handleSearch = (value) => {
    value !== '' ?
      setFilterRes([...guests.filter(x => x.guestFullName.toLowerCase().includes(value.toLowerCase()))])
      :
      setFilterRes([...guests])
  }

  const handleVisitStatus = (e) => {
    setVisitorStatus(e.target.value);
  }

  useEffect(() => {
    getGuests(1)
  }, [visitStatus])

  const handleGuestDelete = (id) => {
    const deletion = window.confirm('Are you sure you want to delete this guest');

    if(deletion)
      axios.delete(BASE_URL + `/guest/delete/${id}`).then(
        res => {
          setTimeout(() => getGuests(1), 50)
          dispatch(setMessage({ type: 'success', message: res.data.message }));
        }
      ).catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      });
  }

  const handleTableAction = (guestId) => {
    if(event.target?.closest('span')?.classList?.contains('deletion'))
      handleGuestDelete(guestId)
    else
      location.href = `/guest/${guestId}`
  }


  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <Alert />
        <div className='flex justify-between items-center flex-wrap gap-y-5'>
          <div className=''>
            <h1 className='font-semibold text-2xl leading-6'>Guests</h1>
            <label className='font-thin text-sm text-gray-500 leading-3'>We 're/will hosting {filterRes?.length}
              <select onChange={handleVisitStatus}>
                <option selected={status === "PENDING" ? true : false } value="PENDING">pending</option>
                <option selected={status === "CANCELED" ? true : false } value="CANCELED">cancelled</option>
                <option selected={status === "IN" ? true : false } value="IN">in</option>
                <option selected={status === "OUT" ? true : false } value="OUT">out</option>
                <option selected={status === "ALL" ? true : false } value="ALL">all</option>
              </select>
            </label>
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
            <tr><th>#</th><th>Guest Names</th><th>Receiver</th><th>From</th><th>Date/Time</th><th className='flex justify-center'>Actions</th></tr>
            {filterRes?.map((guest, index) => (
              <tr key={index} onClick={() => handleTableAction(guest.randomReference)}>
                <td>{index + 1}</td>
                <td>{guest.guestFullName}</td>
                <td>{guest.receiverFullName}</td>
                <td>{guest.comeFrom}</td>
                <td>{guest.date} {guest.time}</td>
                <td className='flex gap-x-5 justify-center'>
                  <span className='preview'><PreviewTwoToneIcon className='cursor-pointer hover:scale-110' /></span>
                  <span className='deletion'><DeleteTwoToneIcon className='cursor-pointer text-red-800 hover:scale-110' /></span>
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
