import React, { useEffect, useState } from 'react'
import { setMessage } from '../../service/reducers/AlertSlice'
import { useDispatch } from 'react-redux'
import Wrapper from '../../layout/Wrapper'
import SubmitButton from '../../components/buttons/SubmitButton'
import axios from 'axios'
import { BASE_URL } from '../../utils/constants'

const EditGuest = ({ toggle, isToggled, data, postOp }) => {
  const [state, setState] = useState()
  const [loading, isLoading] = useState(false)
  const [gates, setGates] = useState([])
  const [hosts, setHosts] = useState([])
  const dispatch = useDispatch()


  useEffect(() => {
    if (data?.randomReference) {
      setState({ ...data, gate: data.Gate.id, HostId: data.Host.id })
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    if (name === 'HostId') {
      console.log(hosts?.filter(item => item.id == value))
      setState({ ...state, [name]: value, callSign: hosts?.filter(item => item.id == value)[0].callSign });
    }
    console.log(state);
  };

  const getGates = () => {
    axios.get(BASE_URL + `/gate/findAll`)
      .then(res => {
        setGates([...res.data.data])
      })
      .catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  const getHosts = () => {
    axios.get(BASE_URL + `/host/findAll`)
      .then(res => {
        setHosts([...res.data.data])
      })
      .catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  useEffect(() => {
    getGates()
    getHosts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    isLoading(true)

    try {
      const res = await axios.put(BASE_URL + '/guest/update', { ...state });
      if (res.status === 200) {
        isLoading(false);
        isToggled(false)
        setTimeout(() => {
          postOp()
        }, 50)
        dispatch(setMessage({ type: 'success', message: 'guest updated successfully' }))
        e.target.reset()
      }
    } catch (error) {
      isLoading(false);
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    }
  }


  return (
    <Wrapper title={"Update Guest"} toggle={toggle} isToggled={isToggled} >
      <form className='py-3' onSubmit={(e) => handleSubmit(e)}>
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="guestFullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.guestFullName}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Full names *
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="guestIdNumber"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.guestIdNumber}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              ID
            </label>
          </div>
        </div>
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="guestPhone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.guestPhone}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Phone Number
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="comeFrom"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.comeFrom}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Come From
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="date" name="date"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Pick a date " required=""
              value={state?.date}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Date
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="time" name="time"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Pick a time " required=""
              value={state?.time}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor=""
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Time
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='HostId'
              value={state?.Host?.id}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Select a Host</option>
              {hosts?.map((item, key) => (
                <option key={key} className='text-xs' value={item.id}>
                  {item.hostName}
                </option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="callSign"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="" required=""
              value={state?.Host?.callSign}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor=""
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Call sign/ extension
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="receiverFullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.receiverFullName}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="receiverFullName"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Receiver full names
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="receiverPhoneNumber"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.receiverPhoneNumber}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Receiver Phone Number
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='guestStatus'
              value={state?.guestStatus}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Select Status</option>
              {['VVIP', 'VIP', 'SENIOR OFFICIAL', 'NORMAL'].map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Guest status
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='guestAnonymous'
              value={state?.guestAnonymous}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Guest state</option>
              {['ANONYMOUS', 'NORMAL'].map((item, key) => (
                <option key={key} className='text-xs capitalize' value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Guest state
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='visitStatus'
              value={state?.visitStatus}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Select Visit status</option>
              {['CANCELLED', 'POSTPONED', 'PENDING', 'VISITED']?.map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Visit status
            </label>
          </div>
        </div>
        <div className='flex justify-around mt-3'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='gate'
              value={state?.Gate?.id}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Select Entrance</option>
              {gates?.map((item, key) => (
                <option key={key} className='text-xs' value={item.id}>
                  {item.gate}
                </option>
              ))}
            </select>
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Guest Entrance
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='conditions'
              value={state?.conditions}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option value="">Select Conditions</option>
              {[
                "Full search",
                "Mirror on car and Body and luggage  scan",
                "Mirror on car and luggage scan only",
                "Mirror on car-luggage scan and work-through",
                "luggage scan only",
                "no search no scan"
              ].map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="receiverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Guest conditions
            </label>
          </div>
        </div>
        <div className='flex justify-start ml-5'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <label for="status text-xs">Comments</label>
            <textarea rows={5} cols={50} name='comment' value={state?.comment} onChange={(e) => { handleChange(e) }} placeholder='Any comment ...' className='border border-gray-200 rounded p-3'></textarea>
          </div>
        </div>
        <div className='flex justify-center mt-5'>
          <SubmitButton value={"Save"} onsubmit={"Saving..."} status={loading} />
        </div>
      </form>
    </Wrapper>
  )
}

export default EditGuest