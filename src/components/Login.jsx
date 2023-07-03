import React from "react";

export default function Login(props) {
    return (
        <div className="login-container">
            <button className="login" onClick={props.login}>login</button>
        </div>
    )
}