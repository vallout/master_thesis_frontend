import React, {useState, useEffect} from 'react';
import {
    withRouter
} from "react-router-dom";
import DatePicker from "react-datepicker";
import {Row, Col, Button, Form, FormGroup, Label, Input, Nav, Navbar, NavItem, NavLink} from 'reactstrap';
import FetchClass from '../fetching';
import "react-datepicker/dist/react-datepicker.css";
import ProjectStatistics from './ProjectStatistics';

function Project(props) {

    const [menu, setMenu] = useState("tasks");

    const [tasks, setTasks] = useState([]);

    const [taskInput, setTaskInput] = useState({
        state: "DO",
        name: "",
        description: "",
        deadline: ""
    });

    const [likedTasks, setLikedTasks] = useState([]);

    let projectId = props.location.pathname.split("/")[2]

    useEffect(() => {
        if (projectId && projectId !== "") {
            FetchClass.getProjectTasks(projectId).then(
                results => {
                    if (typeof results !== "undefined") {
                        for (let result of results) {
                            result.deadline = new Date(result.deadline);
                        }
                        setTasks(results);
                    }
                }
            ).catch(
                error => {
                    setTasks([]);
                }
            )
        }
    }, []);

    useEffect(() => {
        let newLikedTasks = [];
        for (let task of tasks) {
            if (task.likers.includes(props.userId)) {
                newLikedTasks.push(task.taskId);
            }
        }
        newLikedTasks = newLikedTasks.filter(onlyUnique);
        setLikedTasks(newLikedTasks);
    }, [tasks]);

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    const changeTask = (taskId, task) => {
        FetchClass.changeTask(taskId, task)
        .catch(
            error => {
                // DO something
            }
        );
    }

    const likeTask = (taskId) => {
        FetchClass.likeTask(taskId, props.userId)
        .catch(
            error => {
                // DO something
            }
        );
        // update likedTasks:
        let newLikedTasks = [...likedTasks, taskId];
        newLikedTasks = newLikedTasks.filter(onlyUnique);
        setLikedTasks(newLikedTasks);
    }

    const unlikeTask = (taskId) => {
        FetchClass.unlikeTask(taskId, props.userId)
        .catch(
            error => {
                // DO something
            }
        );
        // update likedTasks
        setLikedTasks(likedTasks.filter(item => item !== taskId));
    }

    const setValueOfTasks = (index, value, propertyName) => {
        let tasksCopy = [...tasks];
        tasksCopy[index] = {
            ...tasks[index], [propertyName]: value
        };
        setTasks(tasksCopy);
    }

    const renderAllTasks = () => {
        let allTasks = []
        tasks.forEach(function(task,index) {
            allTasks.push(
                <Col key={task.taskId} xs="12" md="6" lg="4">
                    <Form style={{margin: "2rem"}}>
                        <FormGroup>
                            <Label for={"taskState" + task.taskId}>Task-state:</Label>        
                            <Input id={"taskState" + task.taskId} type="select" value={task.state} onChange={event => setValueOfTasks(index, event.target.value, "state")}>
                                <option>DO</option>
                                <option>DOING</option>
                                <option>FINISHED</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for={"taskName" + task.taskId}>Name:</Label>        
                            <Input id={"taskName" + task.taskId} type="text" value={task.name} onChange={event => setValueOfTasks(index, event.target.value, "name")}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for={"taskDescription" + task.taskId}>Description:</Label>        
                            <Input id={"taskDescription" + task.taskId} type="text" value={task.description} onChange={event => setValueOfTasks(index, event.target.value, "description")}/>
                        </FormGroup>
                        <Label for={"taskDeadline" + task.taskId}>Deadline:</Label>
                        <DatePicker id={"taskDeadline" + task.taskId} selected={task.deadline} onChange={event => setValueOfTasks(index, event.target.value, "deadline")}/>
                    </Form>
                    <Button onClick={() => changeTask(task.taskId, task)} style={{marginRight: "1.5rem"}}>Save Change</Button>
                    {
                        likedTasks.includes(task.taskId)
                        ? <Button onClick={() => unlikeTask(task.taskId)}>Remove Like</Button> 
                        : <Button id={"like " + task.name} onClick={() => likeTask(task.taskId)}>Like Task</Button>
                    }
                </Col>
            )
        });
        return allTasks
    }

    const addTask = () => {
        FetchClass.addTask(props.userId, projectId, taskInput).then(
            result => {
                // console.log(result);
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    const activate = (chosenMenu) => {
        setMenu(chosenMenu);
    }

    const renderMenuChoice = () => {
        if (menu === "tasks") {
            return(
                <div>
                <Row>
                    {renderAllTasks()}
                    <Col xs="12" md="6" lg="4">
                        <Form style={{margin: "2rem"}}>
                            <FormGroup>
                                <Label for="taskState">Task-state:</Label>        
                                <Input id="taskState" type="select" value={taskInput.state} onChange={event => setTaskInput({...taskInput, state: event.target.value})}>
                                    <option>DO</option>
                                    <option>DOING</option>
                                    <option>FINISHED</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="taskName">Name:</Label>        
                                <Input id="taskName" type="text" value={taskInput.name} onChange={event => setTaskInput({...taskInput, name: event.target.value})}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="taskDescription">Description:</Label>        
                                <Input id="taskDescription" type="text" value={taskInput.description} onChange={event => setTaskInput({...taskInput, description: event.target.value})}/>
                            </FormGroup>
                            <Label for="taskDeadline">Deadline:</Label>
                            <DatePicker id="taskDeadline" selected={taskInput.deadline} onChange={date => {
                                setTaskInput({...taskInput, deadline: date});
                            }}/>
                        </Form>
                        <Button id="addTaskButton" onClick={addTask}>Add Task</Button>
                    </Col>
                </Row>
                </div>
            )
        } else {
            return <ProjectStatistics allUsers={props.allUsers}/>
        }
    }

    return(
        <div>
            <Navbar color="faded" expand="xs">
                <Nav  activeKey={window.location.href} className="mr-auto" navbar>
                    <NavItem>
                        <NavLink activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("tasks")}>Tasks</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("statistics")}>Statistics</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
            {renderMenuChoice()}
        </div>
    )
}

export default withRouter(Project);