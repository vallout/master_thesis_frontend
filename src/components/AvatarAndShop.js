import React, {useState, useReducer, useEffect} from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import FetchClass from '../fetching';
import ItemPresentation from './challenges/ItemPresentation';
import AvatarPresentation from './AvatarPresentation';
import { CirclePicker } from 'react-color';

function AvatarAndShop(props) {

    const temporaryAvatarReducer = (state, action) => {
        switch(action.type) {
            case "set": 
                return action.value;
            case "face":
                return {...state, "face": action.value};
            case "hairColor":
                return {...state, "hairColor": action.value}
            case "skinColor":
                return {...state, "skinColor": action.value}
            case "expression":
                return {...state, "expression": action.value}
            default:
                return {...state}
        }
    }

    const [temporaryAvatar, temporaryAvatarDispatch] = useReducer(temporaryAvatarReducer, {...props.mainAvatar});

    const [nextItemToEquip, setNextItemToEquip] = useState({});

    useEffect(() => {
        equippedItemsDispatch(nextItemToEquip);
    }, [nextItemToEquip]);

    useEffect(() => {
        temporaryAvatarDispatch({type: "set", "value": {...props.mainAvatar}});
    }, [props.mainAvatar]);

    const equippedItemsReducer = (state, action) => {
        switch(action.type) {
            case "set": return action.value;
            case "shirt": return {...state, "SHIRT": action.value}
            case "trousers": return {...state, "TROUSERS": action.value}
            case "shoes": return {...state, "SHOES": action.value}
            default: return state;
        }
    }
    const tempEquippedItemsReducer = (state, action) => {
        switch(action.type) {
            case "set": return action.value;
            case "SHIRT": return {...state, "SHIRT": action.value}
            case "TROUSERS": return {...state, "TROUSERS": action.value}
            case "SHOES": return {...state, "SHOES": action.value}
            default: return state;
        }
    }

    const [equippedItems, equippedItemsDispatch] = useReducer(equippedItemsReducer, {});
    const [tempEquippedItems, tempEquippedItemsDispatch] = useReducer(tempEquippedItemsReducer, {});

    const [userItems, setUserItems] = useState([]);

    useEffect(() => {
        retrieveEquippedItems();
        retrieveUserItems();
    }, [props.userId]);


    
    const retrieveEquippedItems = () => {
        FetchClass.getEquippedItems(props.userId).then(
            result => {
                if (result) {
                    equippedItemsDispatch({type: "set", value: result});
                    tempEquippedItemsDispatch({type: "set", value: result});
                }
            }
        ).catch(
            // DO something
        )
    }

    const retrieveUserItems = () => {
        if (props.userId !== "") {
            FetchClass.getUserItems(props.userId).then(
                result => {
                    setUserItems(result);
                }
            ).catch(
                error => {
                    setUserItems([]);
                }
            )
        }
    }
    const renderShopItems = () => {
        let renderedItems = []
        for (let item of props.buyableItems) {
            if (!checkIfUserItemsContain(item.itemId)) {
                renderedItems.push(
                    <Col key={item.itemId} xs="4" style={{marginTop: "2rem"}}>
                        <ItemPresentation name={item.name} itemId={item.itemId} description={item.description}
                        type={item.type} price={item.price} />
                        <br></br>
                        <Button id={"button "+item.name} onClick={() => buyItem(item)}>Buy</Button>
                    </Col>)
            } else {
                renderedItems.push(
                    <Col key={item.itemId} xs="4" style={{marginTop: "2rem"}}>
                        <ItemPresentation name={item.name} itemId={item.itemId} description={item.description}
                        type={item.type} price={item.price} />
                        <br></br>
                        <Button disabled>Bought</Button>
                    </Col>
                )
            }
        }
        return renderedItems;
    }

    const buyItem = (item) => {
        FetchClass.buyItem(props.mainAvatar.userId, item.itemId).then(
            result => {
                if (result) {
                    setUserItems([...userItems, item])
                }
            }
        ).catch(
            error => {
                // DO something
            }
        );
    }

    const checkIfUserItemsContain = (itemId) => {
        if (userItems) {
            for (let itemIdIter of userItems) { 
                if (itemIdIter.itemId === itemId) return true;
            }
        }
        return false;
    }

    const renderUserItems = () => {
        let userItemOptions = [];
        for (let item of userItems) {
            userItemOptions.push(
                <Col xs="4" key={item.itemId} style={{marginTop: "2rem"}}>
                    <ItemPresentation name={item.name} itemId={item.itemId} description={item.description}
                    type={item.type} price={item.price} />
                    <br/>
                    {
                        itemIsEquipped(item.itemId, item.type)
                        ? <Button onClick={() => unequipItemTemp(item.type)}>Unequip</Button>
                        :<Button id={"equip " + item.name} onClick={() => equipItemTemp(item)}>Equip</Button>
                    }
                </Col>
            )
        }
        return userItemOptions;
    }

    const equipItemTemp = (item) => {
        tempEquippedItemsDispatch({type: item.type, value: item});
    }
    const unequipItemTemp = (itemType) => {
        tempEquippedItemsDispatch({type: itemType, value: ""});
    }

    const itemIsEquipped = (itemId, itemType) => {
        if (tempEquippedItems[itemType] && tempEquippedItems[itemType].itemId === itemId) {
            return true;
        }
        return false;
    }

    const updateAvatar = () => {
        FetchClass.changeAvatarLook(props.userId, temporaryAvatar)
        .then(
            result => {
                props.mainAvatarDispatch({type: "set", value: result})
            }
        )
        .catch(
            error => {
                props.notification("Error", "avatar look could not be saved", "danger");
            }
        )
        for (const [key, value] of Object.entries(tempEquippedItems)) {
            if (value !== "") {
                FetchClass.equipAvatarItem(value.itemId, props.userId)
                .then(
                    result => {
                        if (result) {
                            setNextItemToEquip({type: key, value: value});
                        }
                    }
                ).catch(
                    error => {
                        props.notification("Error", "item could not be equipped to the avatar", "danger");
                    }
                );
            } else {
                FetchClass.unequipAvatarItem(key, props.userId)
                .then(
                    result => {
                        if (result) {
                            setNextItemToEquip({type: key, value: value});
                        }
                    }
                ).catch(
                    error => {
                        props.notification("Error", "item could not be equipped to the avatar", "danger");
                    }
                );
            }
        }
    }

    const getAvatarColor = () => {
        // Convert String "xxx, xxx, xxx" to {r: xxx, g: xxx, b: xxx}
        let rgb_string_array;
        if (temporaryAvatar.skinColor) {
            rgb_string_array = temporaryAvatar.skinColor.split(",");
        } else {
            return {};
        }
        return {
            r: parseInt(rgb_string_array[0]),
            g: parseInt(rgb_string_array[1]),
            b: parseInt(rgb_string_array[2])
        }
    }

    const changeAvatarColor = (color, event) => {
        // Convert color {r: xxx, g: xxx, b: xxx} to string "xxx, xxx, xxx"
        const newColor = color.rgb.r + "," + color.rgb.g + "," + color.rgb.b;
        temporaryAvatarDispatch({type: "skinColor", value: newColor})
    }
    
    return(
        <div>
            <h2>Shop and Avatar of User</h2>
            
            <br/>

            <Row>
                <Col xs="4">
                <h4>Avatar</h4>
                    <AvatarPresentation avatar={props.mainAvatar} style={equippedItems}/>
                </Col>
                <Col xs="4">
                <h4>Changed Avatar</h4>
                    <AvatarPresentation avatar={temporaryAvatar} style={tempEquippedItems}/>
                    <br/>
                    <Button id="changeAvatarButton" onClick={updateAvatar}>Save Avatar</Button>
                </Col>
                <Col xs="4">
                <h4>Change look</h4>
                    <Form> 
                    <FormGroup>
                        <Label for="avatarFace">Face:</Label>        
                        <Input id="avatarFace" type="select" value={temporaryAvatar.face} onChange={event => temporaryAvatarDispatch({type: "face", value: event.target.value})}>
                        <option>FEMALE</option>
                        <option>MASKULIN</option>
                        <option>NEUTRAL</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                    <Label for="avatarHair">Hair Color:</Label>        
                        <Input id="avatarHair" type="select" value={temporaryAvatar.hairColor} onChange={event => temporaryAvatarDispatch({type: "hairColor", value: event.target.value})}>
                        <option>BLOND</option>
                        <option>BRUNETTE</option>
                        <option>BLACK</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="colorpicker">Skin Color:</Label>
                        <CirclePicker id="colorpicker" color={getAvatarColor()} onChange={changeAvatarColor}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="avatarExpression">Expression:</Label>        
                        <Input id="avatarExpression" type="select" value={temporaryAvatar.expression} onChange={event => temporaryAvatarDispatch({type: "expression", value: event.target.value})}>
                        <option>COOL</option>
                        <option>HAPPY</option>
                        <option>NEUTRAL</option>
                        </Input>
                    </FormGroup>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs="12" >
                    <h4 style={{marginTop:"2rem"}}>Inventory</h4>
                    <Row>
                        {renderUserItems()}
                    </Row>
                </Col>
            </Row>
            <h4 style={{marginTop:"2rem"}}>Shop</h4>
            <Row>
                {renderShopItems()}
            </Row>
        </div>
    )
}

export default AvatarAndShop;