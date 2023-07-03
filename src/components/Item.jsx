import React from "react";

export default function Item(props) {
    return (
        <div>
            <p>{props.item.name}</p>
        </div>
    )
}