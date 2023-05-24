import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdPreview } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillEye, AiFillSetting } from "react-icons/ai";
import { IconContext } from "react-icons";
import { BiChevronDown } from "react-icons/bi";
import { useDispatch } from "react-redux";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PreviewTwoToneIcon from '@mui/icons-material/PreviewTwoTone';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';

const ActionWrapper = ({
    eye = false,
    edit = false,
    del = false,
    action = false,
    onView,
    onEdit,
    onDelete,
    confirmDeleteMessage
}) => {
    return (
        <div className="flex justify-end items-end">
            <div className="p-1 w-28 h-8 flex space-x-2">
                {eye && (
                    <div
                        onClick={() => {
                            onView();
                        }}
                        className=""
                    >
                        <PreviewTwoToneIcon className='cursor-pointer hover:scale-110'/>
                    </div>
                )}
                {edit && (
                    <div
                        onClick={() => {
                            onEdit();
                        }}
                    >
                        <CreateTwoToneIcon className='cursor-pointer hover:scale-110' />
                    </div>
                )}
                {
                    del && (
                        <div
                            onClick={() => {
                                const confirmBox = window.confirm(confirmDeleteMessage);
                                if (confirmBox === true) {
                                    onDelete();
                                }
                            }}
                            className=""
                        >
                            <DeleteTwoToneIcon className='cursor-pointer text-red-800 hover:scale-110'/>

                            <div className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                                Delete
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </div>
                    )
                }

                {action && (
                    <div className="text-black p-1 w-1/2 rounded-md bg-white cursor-pointer hover:bg-white hover:text-yellow-700 transition delay-150 duration-300 tooltip">
                        <IconContext.Provider value={{ size: "1.1em" }}>
                            <div className="flex justify-start">
                                <AiFillSetting />
                                <BiChevronDown />
                            </div>
                        </IconContext.Provider>

                        <div className="tooltip-viewer">
                            <ul>
                                <li onClick={() => (handleMemberOpClick(status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVE'))}>
                                    {" "}
                                    <span>
                                        {status === "ACTIVE" ? "" : "Confirm"}
                                    </span>{" "}
                                </li>
                                {status !== "PENDING" ? (
                                    <li onClick={() => { handleMemberOpClick('PENDING') }}>
                                        {" "}
                                        <span>Pending</span>{" "}
                                    </li>
                                ) : (
                                    ""
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionWrapper;
