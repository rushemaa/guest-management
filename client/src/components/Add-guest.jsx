import React, { useState, useRef, useEffect } from 'react';
import LeftNav from './Leftnav';
import '../css/Add-guest.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { setMessage } from '../service/reducers/AlertSlice';
import NButton from './buttons/NButton';

export default function AddGuest() {
  const dispatch = useDispatch()
  const [state, setState] = useState({ entryMode: 'BY FOOT', transportation: [] });
  const [car, setCar] = useState(0);
  const [gates, setGates] = useState()
  const [selfDrive, isSelfDrive] = useState();
  const [loading, isLoading] = useState(false);
  const CarContainerRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    console.log(state);
  };

  const appendCar = () => {
    setState({ ...state, transportation: [...transportation, { ...car }] })
    console.log(state)
  }

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...state, [name]: value });
  };

  const handleCar = (e) => {
    const { name, value } = e.target;
    const index = name.charAt(name.length - 1)
    let temp = state?.transportation[index] ? state?.transportation[index] : car ? { "type": 'DRIVER' } : { "type": state?.entryMode }
    const namee = name.slice(0, -1)
    temp = { ...temp, [namee]: value }
    let tempTR = state?.transportation
    tempTR[index] = temp
    setState({ ...state, transportation: [...tempTR] });
    console.log(state);
  };

  // const handleCar = (e) => {
  //   const { name, value } = e.target;
  //   const index = name.charAt(name.length - 1)
  //   const namee = name.slice(0, -1)
  //   setState({
  //     ...state, transportation: state?.transportation?.map((item, i) => {
  //       if (index === i) {
  //         return { ...item, [namee]: value }
  //       }
  //       return item
  //     })
  //   });
  //   console.log(state);
  // };

  const getGates = () => {
    axios.get(BASE_URL + `/gate/findAll`)
      .then(res => {
        setGates([...res.data.data])
      })
      .catch(error => {
        console.log(error);
        // dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  useEffect(() => {
    getGates()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    isLoading(true)

    try {
      const res = await axios.post(BASE_URL + '/guest/create', { ...state });
      if (res.status === 200) {
        isLoading(false);
        isToggled(false)
        postOp()
        dispatch(setMessage({ type: 'success', message: 'Guest registered successfully' }))
        e.target.reset()
      }
    } catch (error) {
      dispatch(setMessage({ type: 'error', message: error.response.data.message }))
    }
  }

  const handleNext = (e) => {
    location.href = '#top'
    const tab = e.target.closest('.tab');
    const tabNum = document.querySelector(`.tab-num[data-id='${tab.dataset.id}']`);
    const tabLink = document.querySelector(`.tab-num[data-id='${tab.dataset.id}'] + .tab-link .tab-fill`);
    const nextTabNum = document.querySelector(`.tab-num[data-id='${tab.dataset.id}'] + .tab-link + .tab-num`);

    tabNum.innerHTML = '✔︎'
    tabLink.classList.add('filled');
    nextTabNum.classList.add('active');

    tab.classList.add('recent-tab');
    tab.style = `margin-left: -${tab.clientWidth}px; transition: all 0.5s ease-in-out;`;
  }

  const handlePrevious = (e) => {
    const tab = e.target.closest('.tab');
    const recentTabNum = document.querySelector(`.tab-num[data-id='${+tab.dataset.id - 1}']`);
    const recentTab = document.querySelector(`.tab[data-id='${+tab.dataset.id - 1}']`);
    const tabLink = document.querySelector(`.tab-num[data-id='${tab.dataset.id - 1}'] + .tab-link .tab-fill`);
    const tabNum = document.querySelector(`.tab-num[data-id='${tab.dataset.id}']`);

    if (!recentTab) return;

    recentTab.style = `margin-left: 0px; transition: all 0.5s ease-in-out`;
    tabNum.classList.remove('active');
    recentTabNum.innerHTML = `${tab.dataset.id - 1}`;
    tabLink.classList.remove('filled');
  }
  const handleTest = () => CarContainerRef.current.addEventListener('click', (e) => {
    e.target.addEventListener('change', (e) => handleCar(e));
  })

  const handleAddCar = (isSelfDrive) => {
    event.preventDefault();

    CarContainerRef.current.insertAdjacentHTML('beforeend',
      `<div class="entry-card">
        <fieldset class='flex flex-col gap-3 p-5'>
          <legend>Car & driver</legend>
          <div class="input-group min-w-[100%]">
            <label for="gnames">Car plate <span class='text-red-400'>*</span></label>
            <input
              type="text"
              id="plate"
              name="plate"
              placeholder="Car Plate Number"
            />
          </div>
          <div class="input-group min-w-[100%]">
            <label for="gnames">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              placeholder="Car Model"
            />
          </div>
          <div class="input-group min-w-[100%]">
            <label for="gnames">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              placeholder="Car Color"
            />
          </div>
          <div class=${!(isSelfDrive) ? '' : 'hidden'}>
            <label for="gnames">Driver name <span class='text-red-400'>*</span></label>
            <input class="input-group min-w-[100%]"
              type="text"
              id="driver"
              name="driver"
              placeholder="Car Driver"
            />
          </div>
          <div class=${!(isSelfDrive) ? '' : 'hidden'}>
            <label for="gnames">Driver contact <span class='text-red-400'>*</span></label>
            <input class="input-group min-w-[100%]"
              type="text"
              id="contact"
              name="contact"
              placeholder="Driver phone number"
            />
          </div>
          <div class=${!(isSelfDrive) ? '' : 'hidden'}>
            <label for="gnames">Driver Id number</label>
            <input class="input-group min-w-[100%]"
              type="text"
              id="id"
              name="id"
              placeholder="Driver National Id"
            />
          </div>
        </fieldset>
      </div>`
    )
    setTimeout(() => {
      setCar(prevState => prevState + 1)
    }, 50)
  };

  const carHTML = (
    <div class="entry-card">
      <fieldset class='flex flex-col gap-3 p-5'>
        <legend>Car & driver</legend>
        <div class="input-group min-w-[100%]">
          <label for="gnames">Car plate <span class='text-red-400'>*</span></label>
          <input
            type="text"
            id="plate"
            name="plate"
            placeholder="Car Plate Number"
          />
        </div>
        <div class="input-group min-w-[100%]">
          <label for="gnames">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            placeholder="Car Model"
          />
        </div>
        <div class="input-group min-w-[100%]">
          <label for="gnames">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            placeholder="Car Color"
          />
        </div>
      </fieldset>
    </div>
  )

  const handleEntryMode = (e) => {
    CarContainerRef.current.innerHTML = "";
    const addBtn = document.querySelector('.add-btn');
    if(e.target.value === "1")
      return addBtn.classList.add("hidden");

    addBtn.classList.remove("hidden");
    if(e.target.value === '2') 
      handleAddCar(true);
    if(e.target.value === '3')
      handleAddCar(false)
  }

  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <h1 className='font-semibold text-2xl w-full text-center' id='top'>Guest Registration</h1>

        <div className='tab-sections'>
          <div className='tab-header'>
            <p className='mx-7'>Steps </p>
            <div className='tab-num active' data-id='1'>1</div>
            <div className='tab-link'>
              <div className='tab-fill'></div>
            </div>
            <div className='tab-num' data-id='2'>2</div>
          </div>
          <div className='tab-content'>
            <div className='tab' data-id='1'>
              <form className='add-guest-form py-3' onSubmit={(e) => handleSubmit(e)}>
                <fieldset>
                  <legend>Guest</legend>

                  <div className="input-row">
                    <div className="input-group">
                      <label for="guestFullName">Guest Names</label>
                      <input
                        type="text"
                        id="guestFullName"
                        name="guestFullName"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="input-group">
                      <label for="guestIdNumber">ID</label>
                      <input
                        type="text"
                        id="guestIdNumber"
                        name="guestIdNumber"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="ID number or Passport"
                      />
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label for="guestPhone">Phone</label>
                      <input
                        type="text"
                        id="guestPhone"
                        name="guestPhone"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="input-group">
                      <label for="comeFrom">From</label>
                      <input
                        type="text"
                        id="comeFrom"
                        name="comeFrom"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Comming From"
                      />
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label for="date">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Pick a date"
                      />
                    </div>
                    <div className="input-group">
                      <label for="time">Time</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Pick a time"
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="input-row">
                  <div className="input-group">
                    <label for="host">Host</label>
                    <select id="host" name='HostId' onChange={(e) => { handleChange(e) }}>
                      <option value="">Select a Host</option>
                      <option value="HDI">HDI</option>
                      <option value="DHDI">DHDI</option>
                      <option value="DI Admin">DI Admin</option>
                      <option value="DI LO">DI LO</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label for="call">Call sign/ extension</label>
                    <input
                      type="text"
                      id="call"
                      name="call"
                      value={state?.callSign}
                      disabled
                      placeholder="Call sign"
                    />
                  </div>
                </div>

                <fieldset>
                  <legend>Receiver</legend>

                  <div className="input-row">
                    <div className="input-group">
                      <label for="receiverFullName">Receiver Names</label>
                      <input
                        type="text"
                        id="receiverFullName"
                        name="receiverFullName"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="input-group">
                      <label for="rphone">Phone</label>
                      <input
                        type="text"
                        id="rphone"
                        name="receiverPhoneNumber"
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </fieldset>

                    <div className="input-row">
                      <div className="input-group">
                        <label for="status">Status</label>
                        <select id="status">
                          <option value="">Select</option>
                          <option value="VVIP">VVIP</option>
                          <option value="VIP">VIP</option>
                          <option value="SENIOR OFFICIAL">Senior official</option>
                          <option value="NORMAL">Normal</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label for="state">Guest State</label>
                        <select id="state">
                          <option value="">Select</option>
                          <option value="ANONYMOUS">Anonymous</option>
                          <option value="NORMAL">Normal</option>
                        </select>
                      </div>
                    </div>

                <div className="input-row">
                  <div className="input-group">
                    <label for="gate">Gate</label>
                    <select id="gate" name='gate' onChange={(e) => { handleChange(e) }}>
                      <option value="">Select Entance</option>
                      {gates?.map((item, key) => (
                        <option key={key} className='text-xs' value={item.id}>
                          {item.gate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label for="conditions">Conditions</label>
                    <select id="conditions" name='conditions' onChange={(e) => { handleChange(e) }}>
                      <option value="">Select Conditions</option>
                      <option value="Full search">Full search</option>
                      <option value="Mirror on car and Body and luggage  scan">
                        Mirror on car and Body and luggage scan
                      </option>
                      <option value="Mirror on car and luggage scan only">
                        Mirror on car and luggage scan only
                      </option>
                      <option value="Mirror on car-luggage scan and work-through">
                        Mirror on car-luggage scan and work-through
                      </option>
                      <option value="luggage scan only">luggage scan only</option>
                      <option value="no search no scan">No search No scan</option>
                    </select>
                  </div>
                </div>
                <div className="input-group min-w-[100%]">
                  <label for="status">Comments</label>
                  <textarea rows={5} name='comment' onChange={(e) => { handleChange(e) }} placeholder='Any comment ...' className='border border-gray-200 rounded p-3'></textarea>
                </div>

                    <div className="input-row">
                      <div className="input-group">
                        <button className="btn-add-guest" type="button" onClick={handleNext}>
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className='tab' data-id='2'>
                  <form className='add-guest-form py-3 relative flex flex-col flex-wrap gap-2 min-h-[99%]' >
                    <div className='flex gap-2 absolute right-0 top-0'>
                      <button onClick={handlePrevious}> <ArrowCircleLeftIcon /> &nbsp; Go back </button>
                      <button className='add-btn hidden' onClick={() => handleAddCar(false)}> <AddCircleIcon /> &nbsp; Add car</button>
                    </div>
                    
                    <div className="entry-card">
                      <fieldset className='p-5'>
                        <legend>Entry mode</legend>
                        <div className="input-group min-w-[100%]">
                          <label for="gnames">Guest Entry Mode</label>
                          <select onChange={handleEntryMode}>
                            <option value="">Choose guest entry mode</option>
                            <option value='1'> on foot </option>
                            <option value='2'> self drive </option>
                            <option value='3'> driver </option>
                          </select>
                        </div>
                      </fieldset>
                    </div>

                <div className="flex flex-wrap justify-between min-h-[20%] gap-2" ref={CarContainerRef} onClick={handleTest}>
                  {
                    state?.entryMode !== 'BY FOOT' ? (
                      <div class="entry-card">
                        <fieldset class='flex flex-col gap-3 p-5'>
                          <legend>Car & driver</legend>
                          <div class="input-group min-w-[100%]">
                            <label for="gnames">Car plate <span class='text-red-400'>*</span></label>
                            <input
                              type="text"
                              id="plateNumber"
                              name="plate"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Car Plate Number"
                            />
                          </div>
                          <div class="input-group min-w-[100%]">
                            <label for="gnames">Model</label>
                            <input
                              type="text"
                              id="model"
                              name="vehicleModel"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Car Model"
                            />
                          </div>
                          <div class="input-group min-w-[100%]">
                            <label for="gnames">Color</label>
                            <input
                              type="text"
                              id="color"
                              name="vehicleColour"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Car Color"
                            />
                          </div>
                          <div class={!(selfDrive) ? '' : 'hidden'}>
                            <label for="gnames">Driver name <span class='text-red-400'>*</span></label>
                            <input class="input-group min-w-[100%]"
                              type="text"
                              id="driver"
                              name="driverFullName"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Car Driver"
                            />
                          </div>
                          <div class={!(selfDrive) ? '' : 'hidden'}>
                            <label for="gnames">Driver contact <span class='text-red-400'>*</span></label>
                            <input class="input-group min-w-[100%]"
                              type="text"
                              id="contact"
                              name="driverPhoneNumber"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Driver phone number"
                            />
                          </div>
                          <div class={!(selfDrive) ? '' : 'hidden'}>
                            <label for="gnames">Driver Id number</label>
                            <input class="input-group min-w-[100%]"
                              type="text"
                              id="id"
                              name="driverNationId"
                              onChange={(e) => { handleCarChange(e) }}
                              placeholder="Driver National Id"
                            />
                          </div>
                          <div className='w-1/3 flex justify-center'>
                            <NButton value={'add car'} onsubmit={'Appending car'} status={loading} onclick={appendCar} />

                          </div>
                        </fieldset>
                      </div>
                    ) : ''
                  }
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <button className="btn-add-guest" type="button">
                      Add Guest
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
