import React from "react";
import { Link } from "react-router-dom";
import forbidden from '../../assets/forbidden.png'

const ForbiddenAccess = () => {
    return (
        <div className="bg-gray-100 h-screen w-full">
            <div className="bg-white p-6  md:mx-auto">
                <div className="flex justify-center">
                <img src={forbidden} width='200px' height='200px'/>
                </div>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Access Denied</h3>
                    <p className="text-gray-600 my-2">You do not have access to this page</p>
                    <div className="py-10 text-center">
                        <Link to='/guests' className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">View guests</Link>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ForbiddenAccess