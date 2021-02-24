import React from 'react';
import UserChallengePresentation from './UserChallengPresentation';
import {Row, Col} from 'reactstrap';

function UserChallenges(props) {
    const renderUserChallenges = () => {
        let userChallenges_tmp = [];

        for (let challenge of props.userChallenges) {
            userChallenges_tmp.push(
                <Col xs="4" key={challenge.userChallengeId}>
                    <UserChallengePresentation event={challenge.event} queryKeyword={challenge.queryKeyword} 
                                    occurrences={challenge.condition} active={challenge.active}
                                    beginning={challenge.beginning} end={challenge.end} description={challenge.description} 
                                    rewardPoints={challenge.rewardPoints} rewardItem={challenge.rewardItem} allItems={props.allItems}
                                    challengeId={challenge.userChallengeId} updateUserChallenges={props.updateUserChallenges}/>
                </Col>
            )
        }

        return userChallenges_tmp;
    }
    return (
        <div style={{marginTop:"2rem"}}>
            <h2>All User Challenges</h2>

            <Row>
                {renderUserChallenges()}
            </Row>
        </div>
    )
}

export default UserChallenges;