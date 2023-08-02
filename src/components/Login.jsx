import React from "react";

export default function Login(props) {
    return (
        <div className="login-outer-container">
            <div className="login-container">
                <button className="login" onClick={props.login}>Login with Spotify</button>
            </div>
            <div className="description">
                <h2>See your top tracks on Spotify!</h2>
                <p>Login using your Spotify account and you view your listening habits over the last 4 weeks, 6 months and all time.</p>
                <p>Made By <a href="https://github.com/nagyb3" target="_blank">Bence Nagy</a>.</p>
            </div>
        </div>
    )
}