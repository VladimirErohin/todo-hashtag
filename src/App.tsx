import React, {useEffect, useRef, useState} from 'react';
import './styled.scss';
import addIcon from './assets/add-todo.png';
import editIcon from './assets/edit-icon.png';
import removeIcon from './assets/remove-icon.png';
import axios from "axios";

type TasksType = {
    id: number,
    task: string,
    tags: string []
}

function App() {

    const [tasks, setTasks] = useState<Array<TasksType>>([]);
    const [taskText, setTaskText] = useState('');
    const [addTask, setAddTask] = useState<TasksType>();
    const [changeTask, setChangeTask] = useState(true);
    const [rerender, setRerender] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axios.get('http://localhost:3030/tasks')
            .then(res => setTasks(res.data))
    }, [rerender]);

    const onAddTask = () => {

        const tagsList = [];
        const task = taskText.split('').filter(t => t !== "#").join('');

        if (taskText.includes('#')) {
            let start = taskText.indexOf('#');
            let tag = taskText.slice(start);
            tagsList.push(tag)
        }

        let taskItem: TasksType = {
            id: Date.now(),
            task: task,
            tags: [...tagsList]
        };

        axios.post('http://localhost:3030/tasks', taskItem)
            .then(() => setRerender(!rerender))
        setAddTask(taskItem)
        setTaskText('');
    };

    const onEditTask = (id: number) => {
        axios.get(`http://localhost:3030/tasks/${id}`)
            .then(res => {
                setAddTask(res.data);
                setTaskText(res.data.task);
            })
        inputRef.current?.focus();
        setChangeTask(!changeTask);
    };

    const onUpdateTask = () => {
        const task = {...addTask}
        let taskItem = {
            task: taskText,
            tags: []
        };
        axios.put(`http://localhost:3030/tasks/${task.id}`, taskItem)
            .then(() => setRerender(!rerender));
        setTaskText('');
        setChangeTask(!changeTask);
    };

    const onRemoveTask = (id: number) => {
        axios.delete(`http://localhost:3030/tasks/${id}`)
            .then(() => setRerender(!rerender));
    };

    const onAddTags = () => {
    };

    return (
        <>
            <div className="header"><h1>HashTag App</h1></div>
            <div className="main">
                <div className="todo-task">
                    <input
                        ref={inputRef}
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                    />
                    <div className="add-btn"
                         onClick={changeTask ? onAddTask : onUpdateTask}>
                        <img src={addIcon} alt="add-button"/>
                    </div>
                </div>
                <div className="list-task">
                    <h2>List tasks</h2>
                    <div className="list-tasks-wrapper">
                        {tasks?.map(t =>
                            <div className='task' key={t.id}>
                                <div className="info-task">
                                    <div className="text-task">{t.task}</div>
                                    <div className="tags-task">
                                        {t.tags.map(tag => <div
                                            key={t.id}
                                            className="tag">
                                            <p>{tag}</p>
                                            <img src={addIcon} className="add-tag" alt="add-button"/></div>)}
                                    </div>
                                </div>

                                <div className="edit-btn" onClick={() => onEditTask(t.id)}>
                                    <img src={editIcon} alt="edit-button"/>
                                </div>
                                <div className="remove-btn" onClick={() => onRemoveTask(t.id)}>
                                    <img src={removeIcon} alt="remove-button"/>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
