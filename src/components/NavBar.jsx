import React from "react";

export default function NavBar(props) {
    return (
        <nav>
            <h1>
                spotify-stats
            </h1>
            <ul>
                <li onClick={(() => props.logout())}>logout</li>
            </ul>
        </nav>
    )
}