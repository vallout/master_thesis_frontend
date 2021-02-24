import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Nav, Navbar, NavLink, NavItem, Row, Col} from 'reactstrap';
import FetchClass from '../../fetching';
import CreateGroupChallenge from './CreateGroupChallenge';
import CreateUserChallenge from './CreateUserChallenge';
import GroupChallenges from './GroupChallenges';
import UCStatistics from './UCStatistics';
import UsageStatistics from './UsageStatistics';
import UserChallenges from './UserChallenges';
import CreateItem from './CreateItem';
import { useReducer } from 'react';

function ChallengesAdministration(props) {
    
    const [participators, setParticipators] = useState([]);

    const allItemsReducer = (state, action) => {
        switch(action.type) {
            case "set": 
                return action.value;
            case "add":
                return [...state, action.value]
            default:
                return state
        }
    }

    const userChallengesReducer = (state, action) => {
        switch(action.type) {
            case "set": 
                return action.value;
            case "add":
                return [...state, action.value]
            default:
                return state
        }
    }

    const groupChallengesReducer = (state, action) => {
        switch(action.type) {
            case "set": 
                return action.value;
            case "add":
                return [...state, action.value]
            case "activate":
                for (let i=0; i < state.length; i++) {
                    if (action.challengeId === state[i].groupChallengeId) {
                        state[i] = {...state[i], running: true}
                    }
                }
                console.log(state);
                console.log("test");
                return [...state]
            case "deactivate":
                for (let i=0; i < state.length; i++) {
                    if (action.challengeId === state[i].groupChallengeId) {
                        state[i] = {...state[i], running: false}
                    }
                }
                console.log(state);
                console.log("test");
                return [...state]
            default:
                return [...state]
        }
    }

    const [allItems, allItemsDispatch] = useReducer(allItemsReducer, []);
    const [userChallenges, userChallengesDispatch] = useReducer(userChallengesReducer, []);
    const [groupChallenges, groupChallengesDispatch] = useReducer(groupChallengesReducer, []);

    const [activeMenu, setActiveMenu] = useState("");

    useEffect(() => {
        initUserChallenges();
        initGroupChallenges();
        updateAllItems();
    }, []);

    const initUserChallenges = () => {
        FetchClass.getAllUserChallenges().then(
            result => {
                userChallengesDispatch({type: "set", value: result});
            }
        ).catch(
            error => {
                userChallengesDispatch({type: "none"});
            }
        )
    }

    const initGroupChallenges = () => {
        FetchClass.getGroupChallenges().then(
            result => {
                groupChallengesDispatch({type: "set", value: result});
            }
        ).catch(
            error => {
                groupChallengesDispatch({type: "none"});
            }
        )
    }

    const updateAllItems = () => {
        FetchClass.getAllItems().then(
            result => {
                allItemsDispatch({type: "set", value: result})
            }
        ).catch(
            error => {
                allItemsDispatch({type: "none"})
            }
        )
    }
 
    const retrieveParticipators = (challengeId) => {
        FetchClass.getParticipatedUserForUC(challengeId).then(
            result => {
                setParticipators(result);
            }
            ).catch(error => {
              console.log('error', error);
              setParticipators([]);
        });
    }

    const activate = menuChoice => {
        setActiveMenu(menuChoice);
    }
    
    const chooseScreen = () => {
        switch(activeMenu) {
            case "showAllUC":
                return (
                    <div>
                        <UserChallenges allItems={allItems} userChallenges={userChallenges} userChallengesDispatch={userChallengesDispatch}/>
                        <GroupChallenges allItems={allItems} groupChallenges={groupChallenges} groupChallengesDispatch={groupChallengesDispatch}/>
                    </div>
                )
            case "createUC":
                return (
                    <Row style={{marginTop: "2rem"}}>
                        <Col>                        
                            <CreateUserChallenge/>
                        </Col>
                        <Col>
                            <CreateGroupChallenge groupChallengesDispatch={groupChallengesDispatch}/>
                        </Col>
                    </Row>
                )
            case "usageStatistics":
                return <UsageStatistics/>
            case "UCStatistics":
                return <UCStatistics  retrieveParticipators={retrieveParticipators} participators={participators}/>
            case "createItem":
                return <CreateItem newItem={props.newItem} setNewItem={props.setNewItem} createNewItem={props.createNewItem} allItems={props.allItems}/>
            default:
                break;
        }
    }
    
    return(
        <div>
            <Navbar color="faded" expand="xs">
                <Nav  activeKey={window.location.href} className="mr-auto" navbar>
                    <NavItem>
                        <NavLink id="createItemNav" activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("createItem")}>Create Item</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink id="showChallengesNav" activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("showAllUC")}>Show Challenges</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink id="createChallengeNav" activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("createUC")}>Create Challenge</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink id="usageStatsNav" activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("usageStatistics")}>Usage Statistics</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink id="gameStatsNav" activeStyle={{color:"black"}} className="nav-link" onClick={() => activate("UCStatistics")}>Gamification Statistics</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
            {chooseScreen()}
        </div>
    )
}

export default ChallengesAdministration;