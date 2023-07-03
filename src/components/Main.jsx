import {useState} from "react";
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
            // console.log(data);
            props.setTopItems(data.items);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main>
            <div className="top-items-input-container">
                <div>
                    <p>type:</p>
                    <button className={requestType === 'artists' ? "selected" : undefined}
                    onClick={() => setRequestType("artists")}>
                        artists
                    </button>
                    <button className={requestType == 'tracks' ? "selected" : undefined}
                    onClick={() => setRequestType("tracks")}>
                        tracks
                    </button>
                </div>
                <div>
                    <p>term:</p>
                    <button className={requestTerm === 'short_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("short_term")}>
                        short term (last 4 weeks)
                    </button>
                    <button className={requestTerm === 'medium_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("medium_term")}>
                        medium term (last 6 months)
                    </button>
                    <button className={requestTerm === 'long_term' ? "selected" : undefined}
                    onClick={() => setRequestTerm("long_term")}>
                        all time
                    </button>
                </div>
                <button className="get-request" onClick={() => getTopItems(localStorage.getItem('access_token'), requestType, requestTerm)}>
                    get request &gt;
                </button>
            </div>
            <div className="top-items-container">
                { props.toptItems && props.topItems.map((item) => {
                    return <Item item={item} />
                })}
            </div>
        </main>
    )
}