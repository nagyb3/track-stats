import {useState, useEffect} from "react";
import axios from "axios";
import "./App.css"
import NavBar from "./components/NavBar";
import Item from "./components/Item";

function App() {
    document.title = 'spotify-stats'

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
    const REDIRECT_URI = "http://localhost:5173/callback"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    const [accessToken, setAccessToken] = useState("");
 
    const [topItems, setTopItems] = useState([]);

    const [requestType, setRequestType] = useState("");

    const [requestTerm, setRequestTerm] = useState("medium_term");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        console.log('params:', params.get('code'))
        const code = params.get("code");

        if (!code) {
            redirectToAuthCodeFlow(CLIENT_ID);
        } else {
            // const accessToken = getAccessToken(CLIENT_ID, code);
            getAccessToken(CLIENT_ID, code);
        }

        console.log('localstorage access-token:', localStorage.getItem('access_token'));
    
        // const hash = window.location.hash
        // let token = window.localStorage.getItem("token")
        // if (!token && hash) {
        //     //gets run on login to spotify button
        //     token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        //     window.location.hash = ""
        //     window.localStorage.setItem("token", token)
        // }
        // setToken(token);
        // getProfile(localStorage.getItem('access_token'));

        // getTopItems(localStorage.getItem('access_token'), 'artists', 'short_term');
        
    }, [])
    
    async function getAccessToken(CLIENT_ID, code) {
        const verifier = localStorage.getItem("verifier");
        const paramsSecond = new URLSearchParams();
        
        paramsSecond.append("client_id", CLIENT_ID)
        paramsSecond.append("grant_type", "authorization_code");
        paramsSecond.append("code", code);
        paramsSecond.append("redirect_uri", "http://localhost:5173/callback");
        paramsSecond.append("code_verifier", verifier);

        const response = fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: paramsSecond
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('access_token', data.access_token);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    async function getProfile(accessTokenn) {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: 'Bearer ' + accessTokenn
          }
        });
      
        const data = await response.json();
        console.log(data);
    }


    async function getMediumTermTopArtist(accessTokenn) {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
                headers: {
                   Authorization: 'Bearer ' + accessTokenn
                }
            });
            const data = await response.json();
            setTopItems(data.items);
        } catch (err) {
            console.error(err);
        }
    }

    async function getTopItems(accessTokenn, itemType, timeRange) {
        console.log(`https://api.spotify.com/v1/me/top/${itemType}`)
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/top/${itemType}?time_range=${timeRange}`, {
                headers: {
                   Authorization: 'Bearer ' + accessTokenn
                }
            });
            const data = await response.json();
            // console.log(data);
            setTopItems(data.items);
        } catch (err) {
            console.error(err);
        }
    }

    const logout = () => {
        console.log('button pressed');
        setToken("")
        window.localStorage.removeItem("token")
        //added
        window.localStorage.removeItem("access_token")
        setTopItems([]);
    }

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
    
        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }

    const renderTopItems = () => {
        return topItems.map(item => (
            <div key={item.id}>
                {item.name}
            </div>
        ))
    }

    //redirect to spotify login page
    //better auth !
    async function redirectToAuthCodeFlow(clientId) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);
    
        localStorage.setItem("verifier", verifier);
    
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://localhost:5173/callback");
        params.append("scope", "user-top-read user-read-private user-read-email");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
    
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    function generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    async function generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    console.log(topItems)

    return (
        <div className="App">
            <NavBar logout={logout} />
            <header className="App-header">
                <h1>header</h1>
                {/* {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>} */}
            </header>
            {/* <form onSubmit={searchArtists}>
                <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search</button>
            </form> */}
            <div className="top-items-input-container">
                <div>
                    <p>type:</p>
                    <button className={requestType === 'artists' && "selected"}
                     onClick={() => setRequestType("artists")}>
                        artists
                    </button>
                    <button className={requestType === 'tracks' && "selected"}
                     onClick={() => setRequestType("tracks")}>
                        tracks
                    </button>
                </div>
                <div>
                    <p>term:</p>
                    <button className={requestTerm === 'short_term' && "selected"}
                     onClick={() => setRequestTerm("short_term")}>
                        short term (last 4 weeks)
                    </button>
                    <button className={requestTerm === 'medium_term' && "selected"}
                     onClick={() => setRequestTerm("medium_term")}>
                        medium term (last 6 months)
                    </button>
                    <button className={requestTerm === 'long_term' && "selected"}
                     onClick={() => setRequestTerm("long_term")}>
                        all time
                    </button>
                </div>
                <button className="get-request" onClick={() => getTopItems(localStorage.getItem('access_token'), requestType, requestTerm)}>
                    get request &gt;
                </button>
            </div>
            {/* {renderArtists()} */}
            <div className="top-items-container">
                {topItems.map((item) => {
                    return <Item item={item} />
                })}
            </div>
        </div>
    );
}

export default App