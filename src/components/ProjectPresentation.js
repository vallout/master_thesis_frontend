import React from 'react';
import { Card, CardBody, CardText, CardTitle } from 'reactstrap';

function ProjectPresentation(props) {

    const renderMembers = () => {
        let memberList = [];

        for (let member of props.members) {
          let member_tmp = "";
          for (let user of props.allUsers) {
            if (user.userId === member) {
              member_tmp = user.firstname + " " + user.lastname;
            }
          }
          memberList.push(
              <CardText key={member.userId} style={{backgroundColor: "lightblue", marginLeft: "8rem", marginRight: "8rem"}}>
                <b>{member_tmp}</b>
              </CardText>
          )
        }

        return memberList;
    }
    return (
        <div>
        <Card>
          <CardBody>
            <CardTitle tag="h5"><u>{props.name}</u></CardTitle>
            <CardText><b>Project-ID: </b>{props.projectId}</CardText>
            <CardText><b>Description</b>: {props.description}</CardText>
            <CardTitle tag="h5">Members</CardTitle>
            {renderMembers()}
          </CardBody>
        </Card>
      </div>
    )
}

export default ProjectPresentation;