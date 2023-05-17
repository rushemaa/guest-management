import React from 'react'
import Loader from './Loader'

const NButton = ({ value, onsubmit, status, onclick }) => {
    return (
        <button
            type='button'
            disabled={status}
            onClick={()=>{onclick()}}
            className='w-4/5 bg-main-color hover:bg-main-color-onhover cursor-pointer px-4 py-2 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker'>
            {status ? (
                <div className='flex items-center space-x-'>
                    <Loader />
                    <span>{onsubmit}</span>
                </div>
            ) : (
                value
            )}
        </button>
    )
}

export default NButton