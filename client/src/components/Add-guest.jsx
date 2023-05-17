import LeftNav from './Leftnav';
import '../css/Add-guest.css';
import React, { useState } from 'react';

export default function AddGuest() {
  const [state, setState] = useState();
  const [status, setStatus] = useState();
  const [loading, isLoading] = useState(false)
  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <h1>Guest Registration</h1>
        <form className="add-guest-form">
          <fieldset>
            <legend>Guest</legend>

            <div className="input-row">
              <div className="input-group">
                <label for="gnames">Guest Names</label>
                <input
                  type="text"
                  id="gnames"
                  name="gnames"
                  placeholder="Full name"
                />
              </div>
              <div className="input-group">
                <label for="idnum">ID</label>
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
                <label for="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                />
              </div>
              <div className="input-group">
                <label for="from">From</label>
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
                <label for="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="Pick a date"
                />
              </div>
              <div className="input-group">
                <label for="time">Time</label>
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
              <label for="host">Host</label>
              <select id="host">
                <option value="">Select a Host</option>
                <option value="HDI">HDI</option>
                <option value="DHDI">DHDI</option>
                <option value="DI Admin">DI Admin</option>
                <option value="DI LO">DI LO</option>
              </select>
            </div>
            <div className="input-group">
              <label for="call">Call sign</label>
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
                <label for="receiver">Receiver Names</label>
                <input
                  type="text"
                  id="receiver"
                  name="receiver"
                  placeholder="Full name"
                />
              </div>
              <div className="input-group">
                <label for="rphone">Phone</label>
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
              <label for="status">Status</label>
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
              <label for="gate">Gate</label>
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
              <label for="conditions">Conditions</label>
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
  );
}
