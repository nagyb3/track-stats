import React from "react";

export default function Item(props) {

    const [thisType, setThisType] = React.useState(props.type); 
    
    return (
        <div className="item-container">
            <p>{props.item.name}</p>
            <p className="name"><a target="_blank" href={props.item.external_urls.spotify}>{props.item.name}</a></p>
            {thisType === 'tracks' ? <p><a target="_blank" href={props.item.artists[0].external_urls.spotify}>{props.item.artists[0].name}</a></p> : undefined}
            {thisType === 'tracks' ? <img src={props.item.album.images[0].url} />
            : <img src={props.item.images[0].url} />}
        </div>
    )
}