import { useState, useEffect } from "react";
import Item from "./Item";

export default function Main(props) {

    const [requestType, setRequestType] = useState("");

    const [requestTerm, setRequestTerm] = useState("medium_term");

    async function getTopItems(accessTokenn, itemType, timeRange) {
        // console.log(`https://api.spotify.com/v1/me/top/${itemType}`)
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/top/${itemType}?time_range=${timeRange}`, {
                headers: {
                   Authorization: 'Bearer ' + accessTokenn
                }
            });
            const data = await response.json();
            props.setTopItems(data.items);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {

    }, [props.topItems])

    return (
        <main>
            <div className="top-items-input-container">
                <div className="select-type">
                    <p>Select type:</p>
                    <button className={requestType === 'artists' ? "selected" : undefined}
                    onClick={() => setRequestType("artists")}>
                        Artists
                    </button>
                    <button className={requestType == 'tracks' ? "selected" : undefined}
                    onClick={() => setRequestType("tracks")}>
                        Tracks
                    </button>
                </div>
                <div className="select-term">
                    <p>Select Term:</p>
                    <button className={requestTerm === 'short_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("short_term")}>
                        Last 4 weeks
                    </button>
                    <button className={requestTerm === 'medium_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("medium_term")}>
                        Last 6 months
                    </button>
                    <button className={requestTerm === 'long_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("long_term")}>
                        All time
                    </button>
                </div>
                <button className="get-request" onClick={() => getTopItems(localStorage.getItem('access_token'), requestType, requestTerm)}>
                    GET REQUEST &gt;
                </button>
            </div>
            <div className="top-items-container">
                { props.topItems && props.topItems.map((item) => {
                    return <Item type={requestType === 'artists' ? 'artists' : 'tracks'}
                     key={item.id} item={item} />
                })}
            </div>
        </main>
    )
}