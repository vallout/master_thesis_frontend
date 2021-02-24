import React, {useState} from 'react';
import {Row, Col, FormGroup, Label, Input, Button} from 'reactstrap';

function MenuGuest(props) {

    const [userMail, setUserMail] = useState("");

    return(
        <div>
            <span>
                <div>
                    <p style={{display: "inline", margin: "3rem", backgroundColor: "lightgreen"}}>User-IP: {props.userIp}</p>
                    <p id="tempPointsField" style={{display: "inline", margin: "3rem", backgroundColor: "lightgreen"}}>Temporary points: {props.temporaryPoints}</p>
                </div>
            </span>
            <Row>
                <Col lg="6">
                    <FormGroup style={{margin: "1rem", display:"inline-flex"}}>
                        <Label for="loginField" style={{marginRight:"1rem", margin: "auto"}}>Email:</Label>        
                        <Input style={{marginRight:"1rem"}} id="loginField" type="text" value={userMail} onChange={event => setUserMail(event.target.value)}></Input>
                        <Button id="loginButton" color="info" onClick={() => props.login(userMail)}>Login</Button>
                    </FormGroup>
                </Col>
            </Row>
        </div>
    )
}

export default MenuGuest;