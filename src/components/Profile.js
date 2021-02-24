import React from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';

function Profile(props) {
    return (
        <div>
            <h2>Profile</h2>
            <Row>
                <Col xs={{size:'6', offset: 3}}>
                    <Form> 
                        <FormGroup>
                        <Label for="userTitle">Title:</Label>        
                        <Input id="userTitle" type="text" value={props.userProfile.title} onChange={event => props.userProfileDispatch({type: "title", value: event.target.value})}></Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="userFirstname">Firstname:</Label>        
                        <Input id="userFirstname" type="text" value={props.userProfile.firstname} onChange={event => props.userProfileDispatch({type: "firstname", value: event.target.value})}></Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="userLastname">Lastname:</Label>        
                        <Input id="userLastname" type="text" value={props.userProfile.lastname} onChange={event => props.userProfileDispatch({type: "lastname", value: event.target.value})}></Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="primaryMail">Email:</Label>        
                        <Input id="primaryMail" type="text" value={props.userProfile.primaryMail} onChange={event => props.userProfileDispatch({type: "mail", value: event.target.value})}></Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="userPhone">Phone</Label>        
                        <Input id="userPhone" type="text" value={props.userProfile.phone} onChange={event => props.userProfileDispatch({type: "phone", value: event.target.value})}></Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="userImage">Picture</Label>        
                        <Input id="userImage" type="text" value={props.userProfile.pictureId} onChange={event => props.userProfileDispatch({type: "pictureId", value: event.target.value})}></Input>
                        </FormGroup>
                    </Form>
                    <Button id="confirmProfile" onClick={props.changeUserProfile} style={{display: "block", marginTop: "3rem"}}>Update Profile</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Profile;