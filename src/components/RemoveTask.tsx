import React, {FC, useEffect} from 'react';
import removeIcon from "../assets/remove-icon.png";
import '../styled.scss'
import axios from "axios";

interface RemoveTaskProps {
    //onRemoveTask: (id:number)=>void;
    idTask:number
}

const DeleteTask:FC<RemoveTaskProps>  = ({ idTask}) => {


    const onRemoveTask = (id: number) => {
        axios.delete(`http://localhost:3030/tasks/${id}`)
    };

    return (
        <>
            <div className="remove-btn" onClick={() => onRemoveTask(idTask)}>
                <img src={removeIcon} alt="remove-button"/>
            </div>
        </>
    );
};

export default DeleteTask;