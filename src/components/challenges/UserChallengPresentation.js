import React from 'react';
import {Card, CardTitle, CardText, CardBody, Button} from 'reactstrap';
import FetchClass from '../../fetching';

function UserChallengePresentation(props) {

    const getItemName = (itemId) => {
        console.log("test");
        console.log(itemId);
        console.log(props.allItems);
        for (let item of props.allItems) {
            if (item.itemId === itemId) {
                return item.name;
            }
        }
    }

    const renderDeactivateButton = () => {
        if (props.end !== null && new Date(props.end) < new Date()) {
            return null;
        } else {
            return <Button onClick={() => deactivateChallenge(props.challengeId)} color="secondary">Deactivate</Button>
        }
    }

    const renderActivateButton = () => {
        if (props.end !== null && new Date(props.end) < new Date()) {
            return null;
        } else {
            return <Button onClick={() => activateChallenge(props.challengeId)} color="success">Activate</Button>
        }
    }

    const deactivateChallenge = (challengeId) => {

        FetchClass.deactivateChallenge(challengeId).then(
            worked => {
                if (worked) {
                    props.updateUserChallenges();
                }
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    const activateChallenge = (challengeId) => {
        FetchClass.activateChallenge(challengeId).then(
            worked => {
                if (worked) {
                    props.updateUserChallenges();
                }
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    return (
        <div>
            { props.active
            ?
            <Card body style={{backgroundColor: "lightgreen"}}>
              <CardBody>
                <CardTitle tag="h5"><u>User Challenge</u></CardTitle>
                <CardText><b>Event:</b> {props.event}</CardText>
                <CardText><b>Query Keyword: </b>{props.queryKeyword}</CardText>
                {
                    props.beginning
                    ?
                    <div>
                        <CardText><b>Start:</b> {new Date(props.beginning).toDateString()}</CardText>
                        <CardText><b>End:</b> {new Date(props.end).toDateString()}</CardText>
                    </div>
                    : null
                }
                <CardText><b>Condition (#occurrences):</b> {props.occurrences}</CardText>
                <CardText><b>Reward: </b> {props.rewardPoints ? props.rewardPoints + " Points" : "Item(" + getItemName(props.rewardItem)+")"}</CardText>
                <CardText><b>ID: </b> {props.challengeId}</CardText>
              </CardBody>   
              {renderDeactivateButton()}
            </Card>
            :            
            <Card body style={{backgroundColor: "lightgrey"}}>
                <CardBody>
                <CardTitle tag="h5"><u>User Challenge</u></CardTitle>
                <CardText><b>Event:</b> {props.event}</CardText>
                <CardText><b>Query Keyword: </b>{props.queryKeyword}</CardText>
                {
                    props.beginning
                    ?
                    <div>
                        <CardText><b>Start:</b> {new Date(props.beginning).toDateString()}</CardText>
                        <CardText><b>End:</b> {new Date(props.end).toDateString()}</CardText>
                    </div>
                    : null
                }
                <CardText style={{marginTop: "1rem"}}><b>Condition (#occurrences):</b> {props.occurrences}</CardText>
                <CardText><b>Reward:</b> {props.rewardPoints ? props.rewardPoints + " Points" : getItemName(props.rewardItem)}</CardText>
                <CardText><b>ID:</b> {props.challengeId}</CardText>
                </CardBody>
                {renderActivateButton()}
            </Card>
            }
          </div>
    );
}

export default UserChallengePresentation;