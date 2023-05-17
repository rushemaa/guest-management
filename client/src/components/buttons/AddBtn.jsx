import React from 'react'

const AddBtn = ({toggler, name}) => {
    return (
        <div className='w-full flex items-center justify-end'>
            <a href="#" onClick={() => { toggler(true) }} className="flex justify-center items-center bg-main-color hover:bg-main-color-onhover text-gray-100 hover:text-gray-100 px-3 py-1.5 border border-blue-600 hover:border-blue-400 rounded-lg transition delay-150 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span className="pl-2 text-xs fon-bold">Add Event</span>
            </a>
        </div>
    )
}

export default AddBtn