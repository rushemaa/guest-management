import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Wrapper from '../../layout/Wrapper';

const ViewMore = ({ view, setView, user }) => {


    const dispatch = useDispatch()
    const auth = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_APP_AUTH))


    const updateUserStatus = (status) => {
        try {
            axios.post('http://197.243.0.108:8080/status', {
                id: user.id,
                status
            }).then(response => {

            });
        } catch (error) {
        }
    };

    useEffect(() => {
        // console.log('in view more');
        // console.log(user)
    }, [user])
    return (
        <Wrapper title={'User information'} toggle={view} isToggled={setView}>
            <div className='pl-5'>
                <div className='grid grid-cols-3 gap-4 py-4'>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Full Names</h3>
                        <h3 className='text-sm my-2'>{user?.fullName}</h3>
                    </div>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Username</h3>
                        <h3 className='text-sm my-2'>{user?.username}</h3>
                    </div>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Institution</h3>
                        <h3 className='text-sm my-2'>{user?.institution}</h3>
                    </div>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Role</h3>
                        <h3 className='text-sm my-2'>{user?.role}</h3>
                    </div>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Status</h3>
                        <h3 className='text-sm my-2'>{user?.status}</h3>
                    </div>
                    <div className='px-3' >
                        <h3 className='text-xs font-bold my-2'>Gate</h3>
                        <h3 className='text-sm my-2'>{user?.role}</h3>
                    </div>
                </div>
            </div>

        </Wrapper>
    )
}

export default ViewMore