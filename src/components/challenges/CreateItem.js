import React, {useState, useEffect} from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col} from 'reactstrap';
import ItemPresentation from './ItemPresentation';
import FetchClass from '../../fetching';

function CreateItem(props) {

    const [allItems, setAllItems] = useState([]);
    const newItemInit = {
        type: "",
        name: "",
        description: "",
        modelId: "",
        price: 0
    }
    const [newItem, setNewItem] = useState(newItemInit);

    useEffect(() => {
        retrieveAllItems();
    }, []);

    const retrieveAllItems = () => {
        FetchClass.getAllItems().then(
        result => {
            if (result !== null || typeof result !== "undefined") {
                setAllItems(result);
            }
        }).catch(
            error => {
              setAllItems([]);
            }
        );
    }

    const showAllItems = () => {
        let itemRender = [];
        for (let item of allItems) {
            itemRender.push(
                <Col key={item.itemId} xs="6" style={{marginTop: "2rem"}}>
                    <ItemPresentation name={item.name} itemId={item.itemId} description={item.description}
                        type={item.type} price={item.price}/>
                </Col>
            )
        }
        return itemRender;
    }

    const createNewItem = () => {
        FetchClass.createNewItem(newItem).then(
            itemId => {
                console.log(itemId);
                setAllItems([...allItems, {...newItem, itemId: itemId}]);
                setNewItem(newItemInit);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }
    
    return(
        <div>
            <Row>
                <Col xs="4">
                    <Row>
                    <Col xs="12">
                        <h2 style={{marginTop:"2rem"}}>Create Items</h2>

                        <Form>
                        <FormGroup>
                            <Label for="itemType">Type:</Label>
                            <Input id="itemType" type="select" defaultValue="None" value={newItem.type} onChange={event => setNewItem({...newItem, type: event.target.value})}>
                            <option value="" disabled>Pick item-type</option>
                            <option>SHIRT</option>
                            <option>TROUSERS</option>
                            <option>SHOES</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="itemName">Name:</Label>        
                            <Input id="itemName" type="text" value={newItem.name} onChange={event => setNewItem({...newItem, name: event.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="itemDescription">Description:</Label>        
                            <Input id="itemDescription" type="text" value={newItem.description} onChange={event => setNewItem({...newItem, description: event.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="itemModelId">Model Id:</Label>        
                            <Input id="itemModelId" type="text" value={newItem.modelId} onChange={event => setNewItem({...newItem, modelId: event.target.value})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="itemPrice">Price:</Label> 
                            <Input id="itemPrice" type="text" value={newItem.price} onChange={event => setNewItem({...newItem, price: event.target.value})}/>
                        </FormGroup>
                        </Form>
                        <Button id="createItemButton" onClick={createNewItem} style={{display: "block", marginTop: "3rem"}}>Create Item</Button>
                    </Col>
                </Row>            
                </Col>
                <Col xs="8">

                    <h2>All Items</h2>

                    <Row>
                        {showAllItems()}
                    </Row>
                </Col>
            </Row>
            

        </div>
    )
}

export default CreateItem;