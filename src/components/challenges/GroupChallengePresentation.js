import React from 'react';
import { useEffect, useState } from 'react';
import {Card, CardTitle, CardText, CardBody, Button} from 'reactstrap';
import FetchClass from '../../fetching';

function GroupChallengePresentation(props) {

  const [active, setActive] = useState(props.active);

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

    const getItemName = (itemId) => {
        for (let item of props.allItems) {
            if (item.itemId === itemId) {
                return item.name;
            }
        }
    }

    const deactivateChallenge = (challengeId) => {
        FetchClass.deactivateGroupChallenge(challengeId).then(
          () => {
            props.groupChallengesDispatch({type: "deactivate", challengeId: challengeId})
          }
        )
        .catch(
          error => {
              // DO something
          }
        );
    }

    const activateChallenge = (challengeId) => {
      FetchClass.activateGroupChallenge(challengeId).then(
        () => {
          props.groupChallengesDispatch({type: "activate", challengeId: challengeId})
        }
      )
      .catch(
        error => {
            // DO something
        }
      );
    }

    return (
        <div>
            { active
            ?
            <Card body style={{backgroundColor: "lightgreen"}}>
              <CardBody>
                <CardTitle tag="h5"><u>Group Challenge</u></CardTitle>
                <CardText><b>Event:</b> {props.event}</CardText>
                <CardText><b>description: </b>{props.description}</CardText>
                <CardText><b>Start: </b> {props.beginning}</CardText>
                <CardText><b>End: </b> {new Date(props.end).toDateString()}</CardText>
                <CardText><b>Condition (#occurrences):</b> {props.occurrences}</CardText>
                <CardText><b>Reward: </b> {props.rewardPoints ? props.rewardPoints + " Points" : getItemName(props.rewardItem)}</CardText>
                <CardText><b>ID: </b> {props.challengeId}</CardText>
              </CardBody>   
              <Button onClick={() => deactivateChallenge(props.challengeId)} color="secondary">Deactivate</Button>
            </Card>
            :            
            <Card body style={{backgroundColor: "lightgrey"}}>
              <CardBody>
                <CardTitle tag="h5"><u>Group Challenge</u></CardTitle>
                <CardText><b>Event:</b> {props.event}</CardText>
                <CardText><b>description: </b>{props.description}</CardText>
                <CardText><b>Start: </b> {props.beginning}</CardText>
                <CardText><b>End: </b> {new Date(props.end).toDateString()}</CardText>
                <CardText><b>Condition (#occurrences):</b> {props.occurrences}</CardText>
                <CardText><b>Reward: </b> {props.rewardPoints ? props.rewardPoints + " Points" : getItemName(props.rewardItem)}</CardText>
                <CardText><b>ID: </b> {props.challengeId}</CardText>
              </CardBody>
              {new Date(props.end) > new Date()
              ?
                <Button id={"activate" + props.description} onClick={() => activateChallenge(props.challengeId)} color="success">Activate</Button>
                : null
              }
            </Card>
            }
          </div>
    );
}

export default GroupChallengePresentation;