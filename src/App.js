import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import FetchClass from './fetching.js';
import { Navbar, Nav, NavItem } from 'reactstrap';
import { SseClassGuest, SseClassUser } from './sseFetching';
import AvatarAndShop from './components/AvatarAndShop';
import ChallengesAdministration from './components/challenges/ChallengesAdministration';
import AllProjects from './components/AllProjects';
import Project from './components/Project';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import { useReducer } from 'react';
import MenuUser from './components/MenuUser';
import MenuGuest from './components/MenuGuest';

function App() {

  const [userIp, setUserIp] = useState("");
  const [userId, setUserId] = useState("");

  const [profileProgress, setProfileProgress] = useState(0);

  // Frontpage
  const [temporaryPoints, setTemporaryPoints] = useState(0);
  const tempPointsRef = useRef({});
  tempPointsRef.current = temporaryPoints;
  
  const mainAvatarInit = {};

  const mainAvatarReducer = (state, action) => {
    switch(action.type) {
      case "set":
        return action.value;
      case "unset":
        return {};
      case "face":
        return {...state, "face": action.value};
      case "hairColor":
        return {...state, "hairColor": action.value}
      case "skinColor":
        return {...state, "skinColor": action.value}
      case "expression":
        return {...state, "expression": action.value}
      case "changePoints":
        return {...state, "points": state.points + action.value}
      default:
        return state;
    }
  }

  const buyableItemsInit = [];

  const buyableItemsReducer = (state, action) => {
    if (action.type === "set") {
      return action.value;
    } else if (action.type === "unset") {
      return [];
    }
  }

  const userProfileInit = {};

  const userProfileReducer = (state, action) => {
    switch(action.type) {
      case "set":
        return action.value;
      case "unset":
        return {};
      case "title":
        return {...state, "title": action.value}
      case "firstname":
        return {...state, "firstname": action.value};
      case "lastname":
        return {...state, "lastname": action.value};
      case "mail":
        return {...state, "primaryMail": action.value};
      case "phone":
        return {...state, "phone": action.value};
      case "pictureId":
        return {...state, "pictureId": action.value};
      default:
        return state;
    }
  }

  const projectsInit = [];

  const projectsReducer = (state, action) => {
    switch(action.type) {
      case "set":
        return action.value;
      case "unset":
        return [];
      case "add":
        return [...state, action.value];
      case "addUser":
        for (let i = 0; i < state.length; i++) {
          if (state[i].projectId === action.projectId) {
            state[i] = {...state[i], "users": [...state[i].users, action.userId]};
            return state
          }
        }
        return state;
      default:
        return state;
    }
  }

  const allUsersInit = [];

  const allUsersReducer = (state, action) => {
    if (action.type === "set") {
      return action.value;
    } else if (action.type === "unset") {
      return [];
    } else {
      return state;
    }
  }

  const addTemporaryPoints = (additionalPoints) => {
    // Reference is used here, because the function is called in the SseFetching-Class
    setTemporaryPoints(tempPointsRef.current + parseInt(additionalPoints));
  }

  const awardPoints = (increase) => {
    mainAvatarDispatch({type: "changePoints", value: increase});
    notification("Points earned", "you earned " + increase + " points!", "success");
  }

  const awardItem = (itemName) => {
    notification("New item", "you earn new " + itemName, "success");
  }

  const updateProfileProgress = (newProgress) => {
    setProfileProgress(newProgress);
  }

  const [mainAvatar, mainAvatarDispatch] = useReducer(mainAvatarReducer, mainAvatarInit);
  const [buyableItems, buyableItemsDispatch] = useReducer(buyableItemsReducer, buyableItemsInit);
  const [userProfile, userProfileDispatch] = useReducer(userProfileReducer, userProfileInit);
  const [projects, projectsDispatch] = useReducer(projectsReducer, projectsInit);
  const [allUsers, allUsersDispatch] = useReducer(allUsersReducer, allUsersInit);

  const initAllUsers = () => {
    FetchClass.getAllUsers()
    .then(
      result => {
        allUsersDispatch({type: "set", value: result});
      }
    ).catch(
      error => {
        notification("Error", "All users could not be retrieved from the server", "danger");
        allUsersDispatch({type: "default"});
      }
    )
  }

  const initProjects = () => {
    FetchClass.getProjects()
    .then(result => {
      projectsDispatch({type: "set", value: result});
    }).catch(
      error => {
        projectsDispatch({type: "default"});
      }
    )
  }

  const initUserData = () => {
    FetchClass.getUser(userId)
    .then(
      result => {
        userProfileDispatch({type: "set", value: result});
      }
    ).catch(
      error => {
        userProfileDispatch({type: "default"});
      }
    )
  }

  const initBuyableItems = () => {
    FetchClass.getBuyableItems()
    .then(
      results => {
        buyableItemsDispatch({type: "set", value: results});
      }
    ).catch(
      error => {
        notification("Error", "Items could not be retrieved from the server", "danger");
      }
    )
  }

  useEffect(() => {
    if (sessionStorage.getItem("email")) {
        login(sessionStorage.getItem("email"));
    } else {    
        initTempPoints();
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // This fires when a user logs in:
      // close sse-connection for guest and open sse-connection for user
      SseClassGuest.closeSse();
      SseClassUser.initiateSse(userId, awardPoints, awardItem, updateProfileProgress);
      
      initUserData();
      initAvatar();
      initBuyableItems();
      initProjects();
      initAllUsers();

      initProfileProgress();

    } else {
      SseClassUser.closeSse();
      userProfileDispatch({type: "unset"});
      mainAvatarDispatch({type: "unset"});
      buyableItemsDispatch({type: "unset"});
      projectsDispatch({type: "unset"});
      allUsersDispatch({type: "unset"});
    }
  }, [userId, userIp]);

  const initAvatar = () => {
    FetchClass.getAvatarOfUser(userId).then(
      result => {
        mainAvatarDispatch({type: "set", value: result});
      }
    ).catch(
      error => {
        notification("Error", "Avatar could not be initialized", "danger");
        mainAvatarDispatch({type: "default"});
      }
    )
  }

  const initTempPoints = () => {
    FetchClass.getIpAddress().then(
      retrievedUserIp => {
        setUserIp(retrievedUserIp);
        FetchClass.getTemporaryPoints(retrievedUserIp)
        .then(points => {
          setTemporaryPoints(points);
        }).catch(
          error => {
            setTemporaryPoints(0);
          }
        );
        SseClassGuest.initiateSse(retrievedUserIp, addTemporaryPoints);
      }
    )
  }

  const notification = (title, message, type) => store.addNotification({
    title: title,
    message: message,
    type: type ? type : "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });

  const triggerTempPointsEvent = name => {
    FetchClass.triggerTmpPointsEvent(name, userIp)
    .catch(
      error => {
        console.log(error);
      }
    );
  }

  const initProfileProgress = () => {
    FetchClass.getProfileProgress(userId).then(
      result => {
        setProfileProgress(result);
      }
    ).catch(
      error => {
        // TODO: Add Notification
        setProfileProgress(0);
      }
    )
  }

  const login = (primaryMail) => {
      FetchClass.loginUser(primaryMail).then(result => {
            setUserId(result.userId);
            sessionStorage.setItem("email", primaryMail);
      }).catch(error => {
            notification("Login failed", "please enter an existing email-address or register", "danger");
      });
  }
  
  const logout = () => {
      setUserId("");
      sessionStorage.removeItem("email");
  }

  const changeUserProfile = () => {
    FetchClass.changeProfile(userId, userProfile).then(
      result => {
        userProfileDispatch({type: "set", value: result});
      }
    ).catch(
      error => {
        notification("Error", "the profile could not be changed", "danger");
        userProfileDispatch({type: "default"});
      }
    );
  }

  return (
    <div>
    <ReactNotification />
    <div className="App" style={{margin: "3rem"}}>

      {
        userId === ""
        ? <MenuGuest login={login} userIp={userIp} temporaryPoints={temporaryPoints}/>
        : <MenuUser logout={logout} userId={userId} points={mainAvatar.points} profileProgress={profileProgress}/>
      }
      <hr/>

      <Router>
        <div>
          <div>
            {
              userId === ""
              ? null
              :<div>
                <Navbar color="faded" expand="xs">
                  <Nav  activekey={window.location.href} className="mr-auto" navbar>
                    <NavItem>
                      <NavLink id="profileNav" activeStyle={{color:"black"}} className="nav-link" to="/profile">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="avatarAndShopNav" activeStyle={{color:"black"}} className="nav-link" to="/avatarandshop">Avatar and Shop</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="ProjectNav" activeStyle={{color:"black"}} className="nav-link" to="/projects">Projects</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="administrationNav" activeStyle={{color:"black"}} className="nav-link" to="/administration">Administration</NavLink>
                    </NavItem>
                  </Nav>
                </Navbar>
              </div>
            }

          </div>
          
          <hr></hr>
          
          <Switch>
            <Route path="/profile">
              <Profile userProfile={userProfile} userProfileDispatch={userProfileDispatch} changeUserProfile={changeUserProfile}/>
            </Route>
            <Route path="/avatarandshop">
              <AvatarAndShop mainAvatar={mainAvatar} mainAvatarDispatch={mainAvatarDispatch} userId={userId}
                            buyableItems={buyableItems} notification={notification}/>
            </Route>
            <Route path="/projects">
              <AllProjects notification={notification} userId={userId} allUsers={allUsers} projects={projects}
                          projectsDispatch={projectsDispatch}/>
            </Route>
            <Route path="/project/:projectId">
              <Project userId={userId} allUsers={allUsers}/>
            </Route>
            <Route path="/administration">
              <ChallengesAdministration/>
            </Route>
            <Route path={["/home", "/"]}>
              <Home triggerTempPointsEvent={triggerTempPointsEvent} userIp={userIp} userId={userId} setUserId={setUserId}
                    notification={notification}/>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
    </div>
  );
}

export default App;
