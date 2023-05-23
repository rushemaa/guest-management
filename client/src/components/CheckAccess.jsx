import React from 'react'
import ForbiddenAccess from './feedback/ForbiddenAccess'

const CheckAccess = ( {children} ) => {
    const auth = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_APP_AUTH))

    return (
        auth?.user?.role !== 'GATE' ? (
            <>{ children }</>
        ) : <ForbiddenAccess />

    )
}

export default CheckAccess