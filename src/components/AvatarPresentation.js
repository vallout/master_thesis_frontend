import React from 'react';
import {Card, CardText, CardBody, CardTitle} from 'reactstrap';

function AvatarPresentation(props) {

    const face = props.avatar.face;
    const haircolor = props.avatar.hairColor;
    const skincolor = props.avatar.skinColor;
    const expression = props.avatar.expression;

    const shirt = props.style["SHIRT"] ? props.style["SHIRT"].name : "nothing equipped";
    const trousers = props.style["TROUSERS"] ? props.style["TROUSERS"].name : "nothing equipped";
    const shoes = props.style["SHOES"] ? props.style["SHOES"].name : "nothing equipped";


    return (
        <div id={"pres" + props.avatar.userId} >
        <Card>
          <CardBody>
            <CardTitle tag="h5"><u>Avatar Look</u></CardTitle>
            <CardText><b>Face: </b>{face}</CardText>
            <CardText><b>Haircolor</b>: {haircolor}</CardText>
            <CardText><b>Skincolor</b>: ({skincolor})</CardText>
            <CardText><b>Facial expression</b>: {expression}</CardText>
            <CardTitle tag="h5"><u>Avatar Style</u></CardTitle>
            {
              props.style 
              ?      
              <div>
                <CardText><b>Shirt</b>: {shirt}</CardText>
                <CardText><b>Trousers</b>: {trousers}</CardText>
                <CardText><b>Shoes</b>: {shoes}</CardText>
              </div>      
              : null
            }
          </CardBody>
        </Card>
      </div>
    )
}

export default AvatarPresentation;