import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import {Form, Input, Button, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';
import FetchClass from '../../fetching';

function CreateGroupChallenge(props) {

    const [rewardToggler, setRewardToggler] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [end, setEnd] = useState(new Date());
    const [condition, setCondition] = useState("");
    const [rewardPoints, setRewardPoints] = useState("");
    const [rewardItem, setRewardItem] = useState("");

    const events = {
        taskCreated: "task created",
        taskFinished: "task finished",
        taskLiked: "task liked",
        userLoggedIn: "user logged in",
        projectJoined: "project joined",
        projectCreated: "project created"
    }

    const setGroupChallengeOptions = () => {
        let userChallengeOptions = []
        userChallengeOptions.push(<option key="default" value="" disabled>Pick event</option>);
        for (const [key, value] of Object.entries(events)) {
            userChallengeOptions.push(<option key={key} value={key}>{value}</option>);
        }
        return userChallengeOptions;
      }

    const createGroupChallenge = () => {
        FetchClass.createGroupChallenge({
            eventName: name,
            description: description,
            end: end,
            condition: condition,
            rewardPoints: rewardPoints,
            rewardItem: rewardItem
        }).then(
            result => {
                const newChallenge = {
                    groupChallengeId: result,
                    eventName: name,
                    description: description,
                    end: end,
                    condition: condition,
                    rewardPoints: rewardPoints,
                    rewardItem: rewardItem
                }
                props.groupChallengesDispatch({type: "add", value: newChallenge})
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    return (
        <div>
            <h2>Create Group Challenge</h2>

            <Form>
            <Input id="groupChallengeEventName" type="select" style={{margin:"1rem"}} value={name} onChange={event => setName(event.target.value)}>
                {setGroupChallengeOptions()}
            </Input>
            <Input id="groupChallengeDescription" type="text" pattern="[0-9]*" placeholder="description..." value={description} onChange={event => setDescription(event.target.value)} style={{margin:"1rem"}}/>
            <ReactDatePicker id="groupChallengeEnd" placeholder="Date end..." selected={end} onChange={event => setEnd(event)}/>
            <Input id="groupChallengeCondition" type="text" placeholder="condition..." value={condition} onChange={event => setCondition(event.target.value)} style={{margin:"1rem"}}/>
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <Input id="groupChallengeRewardType" addon type="checkbox" aria-label="Checkbox to choose reward type" onClick={() => setRewardToggler(!rewardToggler)} />
                    </InputGroupText>
                </InputGroupAddon>
                {
                    rewardToggler
                    ?<Input type="text" placeholder="reward-points..." value={rewardPoints} onChange={event => setRewardPoints(event.target.value)} style={{margin:"1rem"}}/>
                    :<Input id="groupChallengeItemReward" type="text" placeholder="reward-item..." value={rewardItem} onChange={event => setRewardItem(event.target.value)} style={{margin:"1rem"}}/>
                }
            </InputGroup>
            </Form>
            <Button id="createGroupChallengeButton" onClick={createGroupChallenge} style={{display: "block", marginTop: "3rem"}}>New Group Challenge</Button>

        </div>
    )
}

export default CreateGroupChallenge;