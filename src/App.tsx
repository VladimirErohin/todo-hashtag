import React, {useEffect, useState} from 'react';
import './styled.scss';
import addIcon from './assets/add-todo.png';
import axios from "axios";

type TasksType = {
    id: number,
    task: string,
    tags:string []
}

function App() {

    const[tasks, setTasks] = useState <Array <TasksType>>()

    useEffect(()=>{
        axios.get('http://localhost:3030/tasks')
            .then(res=>setTasks(res.data))
    },[])
    return (
        <>
            <div className="header"><h1>HashTag App</h1></div>
            <div className="main">
                <div className="todo-task">
                    <input type="text"/><div className="add-btn"><img src={addIcon} alt="add-button"/></div>
                </div>
                <div className="list-task">
                    <h2>List tasks</h2>
                    <div className="list-tasks-wrapper">
                        {tasks?.map(t=><div>{t.task}</div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
