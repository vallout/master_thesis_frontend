import React from 'react';
import {useReducer, useEffect} from 'react';
import FetchClass from '../fetching';
import {Col, Row, Progress, FormGroup, Button} from 'reactstrap';

function MenuUser(props) {

    useEffect(() => {
        getActiveGroupChallenges();
    }, []);

    const initialGroupChallenges = [];

    const groupChallengesReducer = (state, action) => {
      if (action.type === "add") {
        state.push(action.challenge);
        return state;
      } 
      if (action.type === "set") {
        return action.challenges;
      }
    }
  
    const [groupChallenges, groupChallengesDispatch] = useReducer(groupChallengesReducer, initialGroupChallenges);

    const getActiveGroupChallenges= () => {
      FetchClass.getActiveGroupChallenges()
      .then(challenges => {
        groupChallengesDispatch({type: "set", "challenges": challenges});
      }).catch(
        error => {
          groupChallengesDispatch({type: "set", "challenges": []});
        }
      )
    };

    const renderGroupChallenges = () => {
        let groupChallenges_tmp = [];
        for (let groupChallenge of groupChallenges) {
          groupChallenges_tmp.push(
            <Col key={groupChallenge.groupChallengeId}>
              <div style={{backgroundColor: "lightblue", padding:"1rem"}}>
                  <p style={{margin: "0rem"}}>{groupChallenge.description}</p>
              </div>
            </Col>
          )
        }
        return groupChallenges_tmp;
    }
  
    return (
        <div>
            <span>
            <Row style={{marginBottom: "2rem"}}>
                <Col xs="4">
                    <p style={{display: "inline", backgroundColor: "lightgreen"}}>User-ID: {props.userId}</p>
                </Col>
                <Col xs="4">
                    <p style={{display: "inline", backgroundColor: "lightgreen"}}>Points: {props.points}</p>
                </Col>
                {
                    props.profileProgress !== 100
                    ?
                    <Col>
                    <p style={{display: "inline", backgroundColor: "lightgreen"}}>Profile Progress: </p>
                    <Progress value={props.profileProgress} />
                    </Col>
                    :null
                }
            </Row>
        </span>

        <Row style={{marginBottom: "2rem"}}>
            <Col xs="6">
                <FormGroup style={{margin: "1rem", display:"inline-flex"}}>
                    <div>
                    <Button color="warning" style={{margin:0}} onClick={props.logout}>Logout</Button>
                    </div>
                </FormGroup>
            </Col>
            {renderGroupChallenges()}
        </Row>
      </div>
    )
}

export default MenuUser;