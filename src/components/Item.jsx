import React from "react";

export default function Item(props) {
    return (
        <div key={props.item.id}>
            <p>{props.item.name}</p>
        </div>
    )
}