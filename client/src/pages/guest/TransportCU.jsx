import React, { useEffect, useState } from 'react'
import { setMessage } from '../../service/reducers/AlertSlice'
import axios from 'axios'
import { BASE_URL } from '../../utils/constants'
import { useDispatch } from 'react-redux'
import Wrapper from '../../layout/Wrapper'
import SubmitButton from '../../components/buttons/SubmitButton'

const TransportCU = ({ toggle, isToggled, data, id, postOp }) => {
  const [state, setState] = useState()
  const [loading, isLoading] = useState(false)
  const dispatch = useDispatch()


  useEffect(() => {
    if (data?.id) {
      setState({ ...data, type: data?.transportType })
    } else {
      setState({ randomReference: id })
    }

  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    isLoading(true)
    if (!state?.id) {
      try {
        const res = await axios.post(BASE_URL + '/guest/addTransport', { ...state });
        if (res.status === 200) {
          isLoading(false);
          isToggled(false)
          setTimeout(()=>{
            postOp()
          }, 50)
          dispatch(setMessage({ type: 'success', message: 'Transport registered successfully' }))
          e.target.reset()
        }
      } catch (error) {
        isLoading(false);
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      }
    } else {
      try {
        const res = await axios.put(`${BASE_URL}/guest/updateTransport`, { ...state })
        if (res.data.status == 'ok') {
          isLoading(false);
          isToggled(false)
          setTimeout(()=>{
            postOp()
          }, 50)
          dispatch(setMessage({ type: 'success', message: "Transport Updated successfully" }))
        }
      } catch (error) {
        isLoading(false);
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      }
    }
  }
  return (
    <Wrapper title={state?.id ? "Update Transport" : "Add Transport"} toggle={toggle} isToggled={isToggled} >
      <form id='CU' className='py-3' onSubmit={(e) => handleSubmit(e)}>
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='type'
              value={state?.type} onChange={handleChange}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option className='text-xs' value=''>
                Choose Entry mode *{state?.type}
              </option>
              {['BY FOOT', 'SELF DRIVING', 'DRIVER'].map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={`flex justify-around mt-4 ${state?.type === 'SELF DRIVING' || state?.type === 'DRIVER' ? '' : 'hidden'}`}>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="plateNumber"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.plateNumber}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="plateNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Plate Number *
            </label>
          </div>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="vehicleModel"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.vehicleModel}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="vehicleModel"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Model *
            </label>
          </div>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="vehicleColour"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.vehicleColour}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="vehicleColour"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Color *
            </label>
          </div>
        </div>
        <div className={`flex justify-around mt-4 ${state?.type === 'DRIVER' ? '' : 'hidden'}`}>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="driverFullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.driverFullName}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="driverFullName"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Driver name *
            </label>
          </div>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="driverPhoneNumber"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.driverPhoneNumber}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="driverPhoneNumber"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Driver contact *
            </label>
          </div>
          <div className="relative z-0 w-1/4 mb-2 group">
            <input type="text" name="driverNationId"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.driverNationId}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="driverNationId"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Driver Id Number *
            </label>
          </div>
        </div>
        <div className='flex justify-center mt-5'>
          <SubmitButton value={state?.id?"Update":"Add"} onsubmit={state?.id?"Updating...":"Update"} status={loading} />
        </div>
      </form>
    </Wrapper>
  )
}

export default TransportCU