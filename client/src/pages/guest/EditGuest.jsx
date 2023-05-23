import React, { useEffect, useState } from 'react'
import { setMessage } from '../../service/reducers/AlertSlice'
import { useDispatch } from 'react-redux'

const EditGuest = ({ toggle, isToggled, data, postOp }) => {
  const [state, setState] = useState()
  const [loading, isLoading] = useState(false)
  const [gates, setGates] = useState([])
  const [hosts, setHosts] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (data?.id) {
      setState({ ...data })
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
        const res = await axios.post(BASE_URL + '/account/create', { ...state });
        if (res.status === 200) {
          isLoading(false);
          isToggled(false)
          postOp()
          dispatch(setMessage({ type: 'success', message: 'guest updated successfully' }))
          e.target.reset()
        }
      } catch (error) {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      }
  }


  return (
    <Wrapper title={"Update Guest"} toggle={toggle} isToggled={isToggled} >
      <form className='py-3' onSubmit={(e) => handleSubmit(e)}>
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="fullName"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.fullName}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className="absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Full names *
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='institution'
              value={state?.institution}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option className='text-xs' value=''>
                Institution *
              </option>
              {['DI', 'NISS'].map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="text" name="username"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.username}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="lastname"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Username *
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <select
              name='role'
              value={state?.role}
              onChange={(e) => { handleChange(e) }}
              className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required=''
              autoComplete='off'>
              <option className='text-xs' value=''>
                Role{state?.role} *
              </option>
              {['HOST', 'ADMIN', 'SECURITY OFFICER', 'GATE'].map((item, key) => (
                <option key={key} className='text-xs' value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        {
          state?.role === 'GATE' ? (
            <div className='flex justify-start ml-5'>
              <div className="relative z-0 w-2/5 mb-2 group">
                <select
                  name='GateId'
                  value={state?.gateId}
                  onChange={(e) => { handleChange(e) }}
                  className='block text-sm pl-2 py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                  placeholder=' '
                  required=''
                  autoComplete='off'>
                  <option className='text-xs' value=''>
                    Gate *
                  </option>
                  {gates?.map((item, key) => (
                    <option key={key} className='text-xs' value={item.id}>
                      {item.gate}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : ''
        }
        <div className='flex justify-around'>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="password" name="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.password}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="password"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password *
            </label>
          </div>
          <div className="relative z-0 w-2/5 mb-2 group">
            <input type="password" name="confirmPassword"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" " required=""
              value={state?.confirmPassword}
              onChange={(e) => { handleChange(e) }} autoComplete="off" />
            <label htmlFor="password"
              className=" absolute text-sm text-gray-900 duration-300 font-normal transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Confirm Password *
            </label>
          </div>
        </div>
        <div className='flex justify-center mt-10'>
          <SubmitButton value={"Save"} onsubmit={"Saving..."} status={loading} />
        </div>
      </form>
    </Wrapper>
  )
}

export default EditGuest