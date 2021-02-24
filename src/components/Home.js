import React from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
import { useEffect } from 'react';
import { Button, Form, Input, Col, Row } from 'reactstrap';
import FetchClass from '../fetching';
import AvatarPresentation from './AvatarPresentation';

function Home(props) {

    const [processingRegistration, setProcessingRegistration] = useState(false);

    const [guestInfo, setGuestInfo] = useState({
        "title": "",
        "firstname": "",
        "lastname": "",
        "primaryMail": "",
        "phone": ""
    });

    const initialState = {avatarsEquipment: {}};
    
    const [avatars, setAvatars] = useState([]);

    const reducer = (stateIn, action) => {
        return {
            avatarsEquipment: {...stateIn.avatarsEquipment, [action.id]: action.value}
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        FetchClass.getAllAvatars().then(
          avatarsArg => {
            setAvatars(avatarsArg);
          }
        ).catch(
            error => {
                // TODO: Notification
                setAvatars([]);
            }
        )
      }, []);

      useEffect(() => {

        avatars.map( async avatar => {
            await FetchClass.getEquippedItems(avatar.userId).then(
                equipment => {
                    dispatch({id: avatar.userId, value: equipment});
                }
            ).catch(
                error => {
                    // DO something
                }
            )
        })
      }, [avatars])

    const renderResponseForRegistration = () => {
        if (props.succRegistration === 0) {
            return null;
        } else if (props.succRegistration === 1) {
            return <p>Succesfully registered!</p>
        } else if (props.succRegistration === 2)  {
            return <p style={{color: "red"}}>Registration failed...</p>
        }
    };

    const registerGuest = () => {
      setProcessingRegistration(true);
      FetchClass.registerUser(props.userIp, guestInfo
      ).then(result => {
        props.notification("success", "you have been succesfully registered");
        setProcessingRegistration(false);
      }).catch(error => {
        props.notification("Fail", "registration failed", "danger");
        setProcessingRegistration(false);
      });
    }

    const renderAvatars = () => {
        let avatarCards = []
        for (let avatar of avatars) {
            if(state.avatarsEquipment[avatar.userId]) {
                avatarCards.push(
                    <Col xs="4" key={avatar.userId}>            
                        <AvatarPresentation avatar={avatar}
                        style={state.avatarsEquipment[avatar.userId]}
                        />
                    </Col>
                )
            }
        }
        return avatarCards;
    }

    return (
        <div>
            <h2>Front-Page</h2>

            <Row>
                {renderAvatars()}
            </Row>
            <div>
                <Button id="button1" onClick={() => props.triggerTempPointsEvent("VideoWatched")} style={{margin: "1rem"}}>Video watched</Button>
                <Button id="button2" onClick={() => props.triggerTempPointsEvent("StayedOnPage")} style={{margin: "1rem"}}>Stayed on page</Button>
                <Button id="button3" onClick={() => props.triggerTempPointsEvent("SpecialRegistration")} style={{margin: "1rem"}}>Special Registration</Button>
            
                <br></br>
            
                <Row>
                    <Col xs="6">
                    <h2>Registration</h2>
                    <Form>
                        <Input id="titleField" type="text" placeholder="Title..." value={guestInfo.title} onChange={event => setGuestInfo({...guestInfo, title: event.target.value})} style={{margin:"1rem"}}/>
                        <Input id="firstnameField" type="text" placeholder="Forename..." value={guestInfo.firstname} onChange={event => setGuestInfo({...guestInfo, firstname: event.target.value})} style={{margin:"1rem"}}/>
                        <Input id="lastnameField" type="text" placeholder="Surname..." value={guestInfo.lastname} onChange={event => setGuestInfo({...guestInfo, lastname: event.target.value})} style={{margin:"1rem"}}/>
                        <Input id="emailField" type="email" placeholder="Email..." value={guestInfo.primaryMail} onChange={event => setGuestInfo({...guestInfo, primaryMail: event.target.value})} style={{margin:"1rem"}}/>
                        <Input id="phoneField" type="tel" placeholder="Phone number..." value={guestInfo.phone} onChange={event => setGuestInfo({...guestInfo, phone: event.target.value})} style={{margin:"1rem"}}/>
                    </Form>
                    </Col>
                </Row>
                <Button id="submitButton" disabled={processingRegistration} onClick={registerGuest} 
                        style={{display: "block", marginTop: "3rem"}}>Register</Button>
                
                {renderResponseForRegistration()}
            </div>
        </div>
    )
}

export default Home