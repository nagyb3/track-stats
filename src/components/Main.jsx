import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Item from "./Item";

export default function Main(props) {
  const [requestType, setRequestType] = useState("tracks");

  const [requestTerm, setRequestTerm] = useState("short_term");

  useEffect(() => {
    if (
      requestType !== "" &&
      requestTerm !== "" &&
      localStorage.getItem("access_token") !== null
    ) {
      props.getTopItems(
        localStorage.getItem("access_token"),
        requestType,
        requestTerm
      );
    }
  }, [requestType, requestTerm]);

  return (
    <main>
      <div className="top-items-input-container">
        <div className="select-type">
          <p>Select type:</p>
          <button
            className={requestType === "artists" ? "selected" : undefined}
            onClick={() => {
              setRequestType("artists");
            }}
          >
            Artists
          </button>
          <button
            className={requestType == "tracks" ? "selected" : undefined}
            onClick={() => {
              setRequestType("tracks");
            }}
          >
            Tracks
          </button>
        </div>
        {requestType !== "" && (
          <div className="select-term">
            <p>Select Term:</p>
            <button
              className={requestTerm === "short_term" ? "selected" : undefined}
              onClick={() => setRequestTerm("short_term")}
            >
              Last 4 weeks
            </button>
            <button
              className={requestTerm === "medium_term" ? "selected" : undefined}
              onClick={() => setRequestTerm("medium_term")}
            >
              Last 6 months
            </button>
            <button
              className={requestTerm === "long_term" ? "selected" : undefined}
              onClick={() => setRequestTerm("long_term")}
            >
              All time
            </button>
          </div>
        )}
      </div>
      <div className="top-items-container">
        {props.topItems &&
          props.topItems.map((item) => {
            return (
              <Item
                type={requestType === "artists" ? "artists" : "tracks"}
                key={item.id}
                item={item}
              />
            );
          })}
      </div>
    </main>
  );
}
