import React from "react";
import spotifyicon from "/src/spotify_icon.png";

export default function Item(props) {
  const [thisType, setThisType] = React.useState(props.type);

  function handleImageClick() {
    window.location.href = props.item.external_urls.spotify;
  }

  return (
    <div className="item-container">
      <div className="top-row-container">
        <p className="name">
          <a target="_blank" href={props.item.external_urls.spotify}>
            {props.item.name}
          </a>
        </p>
        <img
          onClick={handleImageClick}
          className="spotify-icon"
          src={spotifyicon}
          alt="Spotify Icon"
        />
      </div>
      {thisType === "tracks" ? (
        <p>
          <a target="_blank" href={props.item.artists[0].external_urls.spotify}>
            {props.item.artists[0].name}
          </a>
        </p>
      ) : undefined}
      {thisType === "tracks" ? (
        <img src={props.item.album.images[0].url} />
      ) : (
        <img src={props.item.images[0].url} />
      )}
    </div>
  );
}
