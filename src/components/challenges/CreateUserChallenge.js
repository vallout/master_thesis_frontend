import React from 'react';
import { useReducer, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import {Form, Input, Button, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';
import FetchClass from '../../fetching';

const events = {
    taskCreated: "task created",
    taskFinished: "task finished",
    taskLiked: "task liked",
    userLoggedIn: "user logged in",
    projectJoined: "project joined",
    projectCreated: "project created"
}


function CreateUserChallenge(props) {

    const [queryKeywords, setQueryKeywords] = useState([]);
    const [rewardToggler, setRewardToggler] = useState(true);

    const userChallengeReducer = (state, action) => {
        switch(action.type) {
            case "event":
                return {...state, event: action.value}
            case "queryKeyword": 
                return {...state, queryKeyword: action.value}
            case "beginning":
                return {...state, beginning: action.value}
            case "end":
                return {...state, end: action.value}
            case "condition":
                return {...state, condition: action.value}
            case "rewardPoints":
                return {...state, rewardPoints: action.value}
            case "rewardItem":
                return {...state, rewardItem: action.value}
        }
    }
    const userChallengeInit = {
        event: "",
        queryKeyword: "",
        beginning: "",
        end: "",
        condition: "",
        rewardPoints: "",
        rewardItem: ""
    }

    const [userChallenge, userChallengeDispatch] = useReducer(userChallengeReducer, userChallengeInit);

    const setEventNameOptions = () => {
        let userEventNameoptions = []
        userEventNameoptions.push(<option key="default" value="" disabled>Pick event</option>);
        for (const [key, value] of Object.entries(events)) {
            userEventNameoptions.push(<option key={key} value={key}>{value}</option>);
        }
        return userEventNameoptions;
    }

    const queryKeywordContainsTime = () => {
        return userChallenge.queryKeyword.includes("Time");
    }

    const setQueryKeywordOptions = () => {
        let queryKeywordOptions = []
        for (let queryKeyword of queryKeywords) {
            queryKeywordOptions.push(<option key={queryKeyword}>{queryKeyword}</option>);
        }
        return queryKeywordOptions;
    }

    const onPickEventName = event => {
        userChallengeDispatch({type: "event", value: event.target.value})
        FetchClass.getQueryKeywords(event.target.value).then(
            result => {
                setQueryKeywords(result);
            }
        ).catch(error => {
                setQueryKeywords([]);
        });
    }

    const createChallenge = () => {
        FetchClass.createUserChallenge(
            userChallenge
        ).then(() => {
            // TODO: Add Notifications
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div>
            <h2>Create User Challenge</h2>

            <Form>
                <Input type="select" style={{margin:"1rem"}} value={userChallenge.event} onChange={event => onPickEventName(event)}>
                    {setEventNameOptions()}
                </Input>
                <Input type="select" style={{margin:"1rem"}} value={userChallenge.queryKeyword} onChange={event => userChallengeDispatch({type: "queryKeyword", value: event.target.value})}>
                    {setQueryKeywordOptions()}
                </Input>
                    {queryKeywordContainsTime()
                    ?
                        <div>
                            <ReactDatePicker placeholder="Date beginning..." selected={userChallenge.beginning} onChange={event => userChallengeDispatch({type: "beginning", value: event})}/>
                            <ReactDatePicker placeholder="Date end..." selected={userChallenge.end} onChange={event => userChallengeDispatch({type: "end", value: event})}/>
                        </div>
                    :
                    null
                    }
                <Input type="text" pattern="[0-9]*" placeholder="condition..." value={userChallenge.condition} onChange={event => userChallengeDispatch({type: "condition", value: event.target.value})} style={{margin:"1rem"}}/>
                
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <Input addon type="checkbox" aria-label="Checkbox to choose reward type" onChange={() => setRewardToggler(!rewardToggler)} />
                        </InputGroupText>
                    </InputGroupAddon>
                    {
                        rewardToggler
                        ?<Input type="text" pattern="[0-9]*" placeholder="reward-points..." value={userChallenge.rewardPoints} onChange={event => userChallengeDispatch({type: "rewardPoints", value: event.target.value})} style={{margin:"1rem"}}/>
                        :<Input type="text" pattern="[0-9]*" placeholder="reward-item..." value={userChallenge.rewardItem} onChange={event => userChallengeDispatch({type: "rewardItem", value: event.target.value})} style={{margin:"1rem"}}/>
                    }
                </InputGroup>

            </Form>
            <Button onClick={createChallenge} style={{display: "block", marginTop: "3rem"}}>New User Challenge</Button>

        </div>
    )
}

export default CreateUserChallenge;