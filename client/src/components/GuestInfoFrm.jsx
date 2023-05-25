import React from 'react'
import NButton from './buttons/NButton'

const GuestInfoFrm = () => {
  return (
    <form className="add-guest-form py-3">
          <fieldset>
            <legend>Guest</legend>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="gnames">Guest Names</label>
                <input
                  type="text"
                  id="gnames"
                  name="gnames"
                  placeholder="Full name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="idnum">ID</label>
                <input
                  type="text"
                  id="idnum"
                  name="idnum"
                  placeholder="ID number or Passport"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                />
              </div>
              <div className="input-group">
                <label htmlFor="from">From</label>
                <input
                  type="text"
                  id="from"
                  name="idnum"
                  placeholder="Comming From"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="Pick a date"
                />
              </div>
              <div className="input-group">
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  placeholder="Pick a time"
                />
              </div>
            </div>
          </fieldset>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="host">Host</label>
              <select id="host">
                <option value="">Select a Host</option>
                <option value="HDI">HDI</option>
                <option value="DHDI">DHDI</option>
                <option value="DI Admin">DI Admin</option>
                <option value="DI LO">DI LO</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="call">Call sign/ extension</label>
              <input
                type="text"
                id="call"
                name="call"
                placeholder="Call sign"
              />
            </div>
          </div>

          <fieldset>
            <legend>Receiver</legend>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="receiver">Receiver Names</label>
                <input
                  type="text"
                  id="receiver"
                  name="receiver"
                  placeholder="Full name"
                />
              </div>
              <div className="input-group">
                <label htmlFor="rphone">Phone</label>
                <input
                  type="text"
                  id="rphone"
                  name="rphone"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </fieldset>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select id="status">
                <option value="">Select</option>
                <option value="VVIP">VVIP</option>
                <option value="VIP">VIP</option>
                <option value="Senior official">Senior official</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="gate">Gate</label>
              <select id="gate">
                <option value="">Select Entance</option>
                <option value="VI">VIP Gate</option>
                <option value="Visitor Gate">Visitor Gate</option>
                <option value="G2 Or Liaison Gate">G2 Or Liaison Gate</option>
                <option value="Staff Gate">Staff Gate</option>
                <option value="Migration">Migration</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="conditions">Conditions</label>
              <select id="conditions">
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
            <label htmlFor="status">Comments</label>
            <textarea rows={5} placeholder='Any comment ...' className='border border-gray-200 rounded p-3'></textarea>
          </div>

          <div className="input-row">
            <div className="input-group">
              <button className="btn-add-guest" type="button" onClick={handleNext}>
                Add Guest
              </button>
            </div>
          </div>
    </form>
  )
}

export default GuestInfoFrm