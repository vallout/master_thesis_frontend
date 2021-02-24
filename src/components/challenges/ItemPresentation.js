import React from 'react';
import {Card, CardBody, CardTitle, CardText} from 'reactstrap';

function ItemPresentation(props) {
    return (
    <div>
        <Card body>
          <CardBody>
            <CardTitle tag="h5"><u>{props.name}</u></CardTitle>
            <CardText id={"id " + props.name}><b>ID</b>: {props.itemId}</CardText>
            <CardText><b>Type: </b>{props.type}</CardText>
            <CardText><b>Description</b>: {props.description}</CardText>
            <CardText><b>Price</b>: {props.price ? props.price : "not buyable"}</CardText>
          </CardBody>
        </Card>
      </div>
    );
}

export default ItemPresentation;