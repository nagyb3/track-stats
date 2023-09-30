import React from "react";

export default function NavBar(props) {
  return (
    <nav>
      <h1>track-stat</h1>
      <ul>
        {props.isLoggedIn && (
          <li className="logout" onClick={() => props.logout()}>
            logout
          </li>
        )}
      </ul>
    </nav>
  );
}
