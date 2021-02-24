import React, { useState } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import FetchClass from '../fetching';
import {
    withRouter
} from "react-router-dom";
import ProjectPresentation from './ProjectPresentation';

function AllProjects(props) {

    const [projectNameInput, setProjectNameInput] = useState("");
    const [projectDescriptionInput, setProjectDescriptionInput] = useState("");

    const renderProjectsOverview = () => {
        let projectsList = [];
        for (let project of props.projects) {
            projectsList.push(
                <Col key={project.projectId} xs="4">
                    <ProjectPresentation projectId={project.projectId} name={project.name} 
                                description={project.description} members={project.users} allUsers={props.allUsers}></ProjectPresentation>
                    <br/>
                    {
                        !checkIfUserIsMember(project)
                        ?<Button id={"join "+project.name} onClick={() => joinProject(project.projectId)}>Join Project</Button>
                        :<Button onClick={() => enterProject(project.projectId)}>Enter Project</Button>
                    }
                </Col>
            )
        }
        return projectsList;
    }

    const enterProject = (projectId) => {
        if (projectId !== null && typeof projectId !== "undefined") {
            props.history.push("/project/" + projectId);
        }
    }

    const checkIfUserIsMember = (project) => {
        for (let member of project.users) {
            if (member === props.userId) return true;
        }
        return false;
    }

    const createProject = () => {
        FetchClass.createProject(projectNameInput, projectDescriptionInput, props.userId).then(
            result => {
                if (result) {
                    props.projectsDispatch({type: "add", value: result});
                }
            }
        ).catch(
            error => {
                props.projectsDispatch({type: ""});
            }
        )
    }

    const joinProject = (projectId) => {
        FetchClass.joinProject(projectId, props.userId).then(
            result => {
                if (projectId) {
                    // TODO:
                    // props.projectsDispatch({type: "addUser", "projectId": projectId, "userId": props.userId});
                    props.history.push("/project/" + projectId);
                }
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    return(
        <div>
            <Row>
                {renderProjectsOverview()}
                <Col xs="4">
                    <Form>
                        <FormGroup>
                            <Label for="projectName">Name:</Label>        
                            <Input id="projectName" type="text" value={projectNameInput} onChange={event => setProjectNameInput(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="projectDescription">description:</Label>        
                            <Input id="projectDescription" type="text" value={projectDescriptionInput} onChange={event => setProjectDescriptionInput(event.target.value)}/>
                        </FormGroup>
                    </Form>
                    <Button onClick={createProject}>Create Project</Button>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(AllProjects);