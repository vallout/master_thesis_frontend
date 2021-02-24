import React, {useEffect, useState} from 'react';
import GroupChallengePresentation from './GroupChallengePresentation';
import {Row, Col} from 'reactstrap';

function GroupChallenges(props) {

    const [challenges, setChallenges] = useState(props.groupChallenges);

    useEffect(() => {
        setChallenges(props.groupChallenges);
    }, [props.groupChallenges]);

    const renderGroupChallenges = () => {
        let groupChallenges_tmp = [];

        for (let challenge of challenges) {
            groupChallenges_tmp.push(
                <Col xs="4" key={challenge.groupEventId}>
                    <GroupChallengePresentation event={challenge.eventName} description={challenge.description} 
                                    occurrences={challenge.condition} active={challenge.running}
                                    beginning={challenge.beginning} end={challenge.end}
                                    rewardPoints={challenge.rewardPoints} rewardItem={challenge.rewardItem} allItems={props.allItems}
                                    challengeId={challenge.groupChallengeId} groupChallengesDispatch={props.groupChallengesDispatch}/>
                </Col>
            )
        }

        return groupChallenges_tmp;
    }
    return (
        <div style={{marginTop:"2rem"}}>
            <h2>Group Challenges</h2>

            <Row>
                {renderGroupChallenges()}
            </Row>
        </div>
    )
}

export default GroupChallenges;