import LeftNav from './Leftnav';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddBtn from './buttons/AddBtn';
import AddUser from '../pages/users/AddUser';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { setMessage } from '../service/reducers/AlertSlice';
import ViewMore from '../pages/users/ViewMore';
import ActionWrapper from './buttons/ActionWrapper';

export default function Admin() {
  const [toggle, isToggled] = useState(false)
  const [view, setView] = useState(false)
  const [users, setUsers] = useState([])
  const [current, setCurrent] = useState({})
  const dispatch = useDispatch()

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


  const handleEdit = (user) => {
    setCurrent(user)
    isToggled(true)
  }
  const handleView = (user) => {
    setCurrent(user)
    setView(true)
  }



  return (
    <div className="App">
      <div className="left-side">
        <LeftNav />
      </div>
      <div className="right-side">
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold text-2xl w-1/2'>System Users</h1>
          <AddBtn toggler={isToggled} name={"Add User"} />
        </div>
        <div className="list py-10">
          <table className='report-table'>
            <tr><th>#</th><th>Names</th><th>Institution</th><th>Role</th><th>Active</th><th className='flex justify-center'>Action</th></tr>
            {
              users?.map((user, index) => (
                <tr><td>{index + 1}</td><td>{user.fullName}</td><td>{user.institution}</td><td>{user.role}</td><td>{user.status}</td>
                  <td>
                    <div className='flex justify-end'>
                      <ActionWrapper
                        eye={true}
                        edit={true}
                        del={true}
                        onEdit={() => { handleEdit(user) }}
                        onView={() => { handleView(user) }}
                        onDelete={() => { handleDelete(user.id) }}
                        confirmDeleteMessage="Do you really want to delete those members"
                      />
                    </div>
                  </td></tr>
              ))
            }
            <tr><td colSpan={6} className='text-right'>Total: {users?.length}</td></tr>
          </table>
        </div>
      </div>
      <AddUser toggle={toggle} isToggled={isToggled} data={current} postOp={getUsers} />
      <ViewMore view={view} setView={setView} user={current} />

    </div>
  );
}
