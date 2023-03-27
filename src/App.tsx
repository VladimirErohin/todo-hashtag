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
    const [addTask, setAddTask] = useState<TasksType>();
    const [taskText, setTaskText] = useState({text:'' , tags:''});
    const [changeTask, setChangeTask] = useState(true);
    const [rerender, setRerender] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axios.get('http://localhost:3030/tasks')
            .then(res => setTasks((res.data).reverse()))
    }, [rerender]);

    const onAddTask = () => {

        let tagsList:string []= [];

        if(taskText.tags.length>0){
            const arrTags:string [] = taskText.tags.slice(1).replace(/#/g , ",").split(',')
            tagsList = arrTags
        }

        let taskItem: TasksType = {
            id: Date.now(),
            task: taskText.text,
            tags: [...tagsList]
        };

        axios.post('http://localhost:3030/tasks', taskItem)
            .then(() => setRerender(!rerender))
        setAddTask(taskItem)
        setTaskText({text:'', tags: ''});
    };

    const onEditTask = (id: number) => {
        axios.get(`http://localhost:3030/tasks/${id}`)
            .then(res => {
                setAddTask(res.data);
                setTaskText({text:res.data.task,
                    tags:res.data.tags.map((el:string)=>"#"+el).join('')});
            })
        inputRef.current?.focus();
        setChangeTask(!changeTask);
    };

    const onUpdateTask = () => {
        const task = {...addTask}
        const arrTags = taskText.tags.slice(1).replace(/#/g , ",").split(',');
        let text = null

        if (taskText.text.includes('#')) {
            let start = taskText.text.indexOf('#');
            text = taskText.text.slice(0, start)
            let tag = taskText.text.slice(start+1);
            arrTags.push(tag)
        }

        let taskItem = {
            task: text,
            tags: arrTags
        };

        axios.put(`http://localhost:3030/tasks/${task.id}`, taskItem)
            .then(() => setRerender(!rerender));
        setTaskText({text:"", tags: ""});
        setChangeTask(!changeTask);
    };

    const onRemoveTask = (id: number) => {
        axios.delete(`http://localhost:3030/tasks/${id}`)
            .then(() => setRerender(!rerender));
    };

    return (
        <>
            <div className="header"><h1>HashTag App</h1></div>
            <div className="main">
                <div className="todo-task">
                    <div className="task-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            value={taskText.text}
                            onChange={(e) => setTaskText({...taskText, text:e.target.value})}
                        />
                        <div className="add-btn"
                             onClick={changeTask ? onAddTask : onUpdateTask}>
                            <img src={addIcon} alt="add-button"/>
                        </div>
                    </div>

                    <div >
                        <input
                            type="text"
                            className='tags-list'
                            placeholder='#tags'
                            value={taskText.tags}
                            onChange={(e) => setTaskText({...taskText, tags:e.target.value})}
                        />
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
                                        {t.tags.map((tag) => <div
                                            key={tag}
                                            className="tag">
                                            <p>#{tag}</p>
                                        </div>)}
                                    </div>
                                </div>

                                <div className="edit-btn" onClick={() => onEditTask(t.id)}>
                                    <img src={editIcon} className="btn-list" alt="edit-button"/>
                                </div>
                                <div className="remove-btn" onClick={() => onRemoveTask(t.id)}>
                                    <img src={removeIcon} className="btn-list" alt="remove-button"/>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
