import LeftNav from './Leftnav';
import '../css/Add-guest.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { setMessage } from '../service/reducers/AlertSlice';
import NButton from './buttons/NButton';
import Alert from './feedback/Alert';
import { useNavigate } from 'react-router-dom';
import SubmitButton from './buttons/SubmitButton';
import ActionWrapper from './buttons/ActionWrapper';
import CheckAccess from './CheckAccess';
import Loader from './buttons/Loader';

export default function AddGuest() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [state, setState] = useState({ entryMode: 'BY FOOT', transportation: [] });
  const [car, setCar] = useState({});
  const [gates, setGates] = useState()
  const [hosts, setHosts] = useState([])
  const [selfDrive, isSelfDrive] = useState();
  const [loading, isLoading] = useState(false);
  const CarContainerRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    if (name === 'HostId') {
      console.log(hosts?.filter(item => item.id == value))
      setState({ ...state, [name]: value, callSign: hosts?.filter(item => item.id == value)[0].callSign });
    }
    console.log(state);
  };

  const appendCar = () => {
    console.log('appending car')
    console.log(car);
    setState({ ...state, transportation: [...state?.transportation, { ...car }] })
    console.log(state)
    setCar({ plateNumber: '', vehicleColour: '', vehicleModel: '', driverFullName: '', driverPhoneNumber: '', driverNationId: '' })
  }

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCar({ ...car, "type": state?.entryMode, [name]: value });
    console.log(car)
  };

  const handleEditCar = (car) => {
    setCar({ ...car })
    handleEntryMode(car?.type === 'BY FOOT' ? '1' : car?.type === 'SELF DRIVING' ? '2' : '3')
    handleDeleteCar(car)
  }
  const handleDeleteCar = (car) => {
    setState({ ...state, transportation: [...state?.transportation?.filter(item => item.plateNumber !== car.plateNumber)] })
  }

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
      const res = await axios.post(BASE_URL + '/guest/create', { ...state });
      if (res.status === 200) {
        isLoading(false);
        navigate('/guests')
        dispatch(setMessage({ type: 'success', message: 'Guest registered successfully' }))
        e.target.reset()
      }
    } catch (error) {
      isLoading(false);
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
    e.preventDefault()
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

  const handleEntryMode = (value) => {
    isSelfDrive(value === '2')
    setState({ ...state, entryMode: value === '1' ? "BY FOOT" : value === '2' ? 'SELF DRIVING' : 'DRIVER' })
  }

  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <CheckAccess>
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
                <form className='add-guest-form py-3' onSubmit={(e) => { handleSubmit(e) }}>
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
                        {hosts?.map((item, key) => (
                          <option key={key} className='text-xs' value={item.id}>
                            {item.hostName}
                          </option>
                        ))}
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
                      <select id="status" name='guestStatus' onChange={(e) => { handleChange(e) }}>
                        <option value="">Select</option>
                        <option value="VVIP">VVIP</option>
                        <option value="VIP">VIP</option>
                        <option value="SENIOR OFFICIAL">Senior official</option>
                        <option value="NORMAL">Normal</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label for="state">Guest State</label>
                      <select id="state" name='guestAnonymous' onChange={(e) => { handleChange(e) }}>
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
                    {/* <button className='add-btn hidden' onClick={() => handleAddCar(false)}> <AddCircleIcon /> &nbsp; Add car</button> */}
                  </div>

                  <div className="entry-card">
                    <fieldset className='p-5'>
                      <legend>Entry mode</legend>
                      <div className="input-group min-w-[100%]">
                        <label for="gnames">Guest Entry Mode</label>
                        <select value={state?.entryMode} onChange={(e) => { handleEntryMode(e.target.value) }}>
                          <option value="">Choose guest entry modee {selfDrive}</option>
                          <option value='1'> on foot </option>
                          <option value='2'> self drive </option>
                          <option value='3'> driver </option>
                        </select>
                      </div>
                    </fieldset>
                  </div>

                  <div className="flex flex-wrap justify-between min-h-[20%] gap-2">
                    {
                      state?.entryMode !== 'BY FOOT' ? (
                        <>
                          <div class="entry-card">
                            <fieldset class='flex flex-col gap-3 p-5'>
                              <legend>Car & driver</legend>
                              <div class="input-group min-w-[100%]">
                                <label for="gnames">Car plate <span class='text-red-400'>*</span></label>
                                <input
                                  type="text"
                                  id="plateNumber"
                                  name="plateNumber"
                                  value={car?.plateNumber}
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
                                  value={car?.vehicleModel}
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
                                  value={car?.vehicleColour}
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
                                  value={car?.driverFullName}
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
                                  value={car?.driverPhoneNumber}
                                  onChange={(e) => { handleCarChange(e) }}
                                  placeholder="Driver phone number"
                                />
                              </div>
                              <div class={!(selfDrive) ? '' : 'hidden'}>
                                <label for="gnames">Driver Id numberrrr</label>
                                <input class="input-group min-w-[100%]"
                                  type="text"
                                  id="id"
                                  name="driverNationId"
                                  value={car?.driverNationId}
                                  onChange={(e) => { handleCarChange(e) }}
                                  placeholder="Driver National Id"
                                />
                              </div>
                              <div className='w-1/3 flex justify-center'>
                                <button
                                  type='button'
                                  onClick={() => { appendCar() }}
                                  className='w-4/5 bg-main-color hover:bg-main-color-onhover cursor-pointer px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker'>
                                  {false ? (
                                    <div className='flex items-center space-x-2'>
                                      <Loader />
                                      <span>appending car...</span>
                                    </div>
                                  ) : (
                                    "add car"
                                  )}
                                </button>
                              </div>
                            </fieldset>
                          </div>


                          <div class="entry-card p-5">
                            {
                              state?.transportation?.map((item, index) => (
                                <div className='grid gap-x-10 gap-y-3 grid-cols-3 border-t border-b'>
                                  <div className='flex flex-col'>
                                    <label>Car plate</label>
                                    <span className='text-sm text-gray-600'>{item.plateNumber ?? 'N/A'}</span>
                                  </div>
                                  <div className='flex flex-col'>
                                    <label>Model</label>
                                    <span className='text-sm text-gray-600'>{item.vehicleModel ?? 'N/A'}</span>
                                  </div>
                                  <div className='flex flex-col'>
                                    <label>Color</label>
                                    <span className='text-sm text-gray-600'>{item.vehicleColour ?? 'N/A'}</span>
                                  </div>
                                  {
                                    item?.driverFullName ? (
                                      <div className='flex flex-col'>
                                        <label>Driver</label>
                                        <span className='text-sm text-gray-600'>{item.driverFullName}</span>
                                      </div>
                                    ) : ''
                                  }
                                  {
                                    item?.driverPhoneNumber ? (
                                      <div className='flex flex-col'>
                                        <label>Driver Contact</label>
                                        <span className='text-sm text-gray-600'>{item.driverPhoneNumber}</span>
                                      </div>
                                    ) : ''
                                  }
                                  {
                                    item?.driverNationId ? (
                                      <div className='flex flex-col'>
                                        <label>Id Numbere</label>
                                        <span className='text-sm text-gray-600'>{item.driverNationId}</span>
                                      </div>
                                    ) : ''
                                  }

                                  <div className='flex justify-end'>
                                    <ActionWrapper
                                      edit={true}
                                      del={true}
                                      onEdit={() => { handleEditCar(item) }}
                                      onDelete={() => { handleDeleteCar(item) }}
                                      confirmDeleteMessage="Do you remove this car"
                                    />
                                  </div>


                                </div>
                              ))
                            }
                          </div>
                        </>
                      ) : ''
                    }
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <button
                        type='button'
                        disabled={loading}
                        onClick={(e) => { handleSubmit(e) }}
                        className='w-4/5 bg-main-color hover:bg-main-color-onhover cursor-pointer px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker'>
                        {loading ? (
                          <div className='flex items-center space-x-2'>
                            <Loader />
                            <span>Adding...</span>
                          </div>
                        ) : (
                          "Add Guest"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </CheckAccess>
    </div>
  );
}
