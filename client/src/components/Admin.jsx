import LeftNav from './Leftnav';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddBtn from './buttons/AddBtn';
import AddUser from '../pages/users/AddUser';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export default function Admin() {
  const [toggle, isToggled] = useState(false)
  const [users, setUsers] = useState([])

  const getUsers = async (page) => {
    axios.get(BASE_URL + `/account/findAll/${page}`)
      .then(res => {
        setUsers([...res.data.data])
      })
      .catch(error => {
        dispatch(setMessage({ type: 'error', message: error.response.data.message }))
      })
  }

  useEffect(() => {
    getUsers(1)
  }, [])

  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl'>System Users</h1>
          <AddBtn toggler={isToggled} name={"Add User"} />
        </div>
        <div className="list py-10">
          <table className='w-full report-table'>
            <tr><th>#</th><th>Names</th><th>Instutition</th><th>Role</th><th>Action</th></tr>
            {
              users?.map((user, index) => (
                <tr><td>{user.id}</td><td>{user.fullName}</td><td>{user.institution}</td><td>{user.role}</td><td>Actions</td></tr>

              ))
            }
            <tr><td colSpan={5} className='text-right'>Total: {users?.length}</td></tr>
          </table>
        </div>
      </div>
      <AddUser toggle={toggle} isToggled={isToggled} postOp={getUsers} />
    </div>
  );
}
