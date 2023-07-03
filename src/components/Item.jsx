import React from "react";

export default function Item(props) {

    const [thisType, setThisType] = React.useState(props.type); 
    // console.log(props.item.album.images[0].url);
    // console.log(props.item.images[0].url);  
    return (
        <div className="item-container">
            <p className="name">{props.item.name}</p>
            {thisType === 'tracks' ? <p>{props.item.artists[0].name}</p> : undefined}
            {thisType === 'tracks' ? <img src={props.item.album.images[0].url} />
            : <img src={props.item.images[0].url} />}
        </div>
    )
}