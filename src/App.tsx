import React, {useEffect, useState} from 'react';
import './styled.scss';
import addIcon from './assets/add-todo.png';
import editIcon from './assets/edit-icon.png';
import removeIcon from './assets/remove-icon.png';
import axios from "axios";
import DeleteTask from "./components/RemoveTask";

type TasksType = {
    id: number,
    task: string,
    tags: string []
}

function App() {

    const [tasks, setTasks] = useState<Array<TasksType>>([]);
    const [taskText, setTaskText] = useState('');
    const [taskInfo, setTaskInfo] = useState<TasksType>();
    const [editTask, setEditTask] = useState<TasksType | undefined>();
    //const [remove, setRemove] = useState(0);

    const data: Array<TasksType> = [...tasks]

    useEffect(() => {
        axios.get('http://localhost:3030/tasks')
            .then(res => setTasks(res.data))

    }, [taskInfo]);

    const onAddTask = () => {
        let taskItem: TasksType = {
            id: Date.now(),
            task: taskText,
            tags: []
        };

        axios.post('http://localhost:3030/tasks', taskItem)

        setTaskInfo(taskItem);
        setTaskText('');
    };

    const onEditTask = (id: number) => {
        axios.get(`http://localhost:3030/tasks/${id}`)
            .then(res=>setTaskText(res.data.task))
    };

    const onRemoveTask = (id: number) => {
        axios.delete(`http://localhost:3030/tasks/${id}`)
    };


    return (
        <>
            <div className="header"><h1>HashTag App</h1></div>
            <div className="main">
                <div className="todo-task">
                    <input type="text" value={taskText} onChange={(e) => setTaskText(e.target.value)}/>
                    <div className="add-btn" onClick={onAddTask}><img src={addIcon} alt="add-button"/></div>
                </div>
                <div className="list-task">
                    <h2>List tasks</h2>
                    <div className="list-tasks-wrapper">
                        {data?.map(t =>
                            <div className='task' key={t.id}>
                                {t.task}
                                <div className="edit-btn" onClick={()=>onEditTask(t.id)}><img src={editIcon} alt="edit-button"/></div>
                                <div className="remove-btn" onClick={() => onRemoveTask(t.id)}>
                                    <img src={removeIcon} alt="remove-button"/>
                                </div>
                                {/*<DeleteTask idTask={t.id}/>*/}
                            </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
