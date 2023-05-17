import React from 'react'
import { ImCross } from 'react-icons/im'

const Wrapper = ({ title, toggle, isToggled, children }) => {
    return (
        <div
            style={{ backdropFilter: 'blur(5px)', zIndex: '1002' }}
            className={`fixed flex items-center align-center bg-gray-500 bg-opacity-50 z-50 show w-full md:inset-0 md:h-full ${toggle ? '' : ' hidden'
                }`}>
            <div className='relative w-full h-full flex justify-center p-4 items-center md:h-screen'>
                <div className='relative bg-white rounded-lg w-2/3 shadow dark:bg-gray-700'>
                    <div className='flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600'>
                        <h3 className='text-sm font-bold text-center text-gray-900 dark:text-white'>
                            {title}
                        </h3>
                        <button
                            type='button'
                            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                            onClick={() => isToggled(!toggle)}>
                            <ImCross />
                        </button>
                    </div>
                    <div className='mx-4 my-2'>
                        {children}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Wrapper