import React from 'react';
import { Button, Row } from 'reactstrap';

function AllUsers(props) {
    return (
        <div>
            <h2>All Users/Avatars</h2>

            <Button onClick={props.toggleAllUsers} style={{display: "block", marginTop: "3rem"}}>Show all users</Button>
            <br></br>
            <Row>
            {props.showAllUsers()}
            </Row>
            <br/>
            <Button onClick={props.toggleAllAvatars} style={{display: "block", marginTop: "3rem"}}>Show all avatars</Button>
            <br></br>
            <Row>
            {props.showAllAvatars()}
            </Row>
        </div>
    )
}

export default AllUsers;