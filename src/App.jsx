import {useState, useEffect} from "react";
import "./App.css"
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Main from "./components/Main";

function App() {
    document.title = 'spotify-stats';

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

    // const [token, setToken] = useState("");
    
    const [topItems, setTopItems] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    console.log(localStorage.getItem('access_token'));
    console.log(localStorage.getItem('access_token') === null);

    useEffect(() => {
        setIsLoggedIn(false);
        //check if code
        // true: setisloggedin true
        const fetchData = async() => {
            // if (localStorage.getItem('access_token') === null) {
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            if (localStorage.getItem('access_token') !== null) {
                setIsLoggedIn(true);
            } else if (code) {
                // console.log('kasoidowa')
                await getAccessToken(CLIENT_ID, code);
                setIsLoggedIn(true);
            }
            // }
        // console.log('useeffect ran')
        // if (localStorage.getItem('access_token') !== null) {
        //     console.log('in')
        //     setIsLoggedIn(true);
        // }
        
        }
        fetchData();
    }, []);
    
    async function getAccessToken(clientVar, code) {
        const verifier = localStorage.getItem("verifier");
        const paramsSecond = new URLSearchParams();
        
        paramsSecond.append("client_id", clientVar);
        paramsSecond.append("grant_type", "authorization_code");
        paramsSecond.append("code", code);
        paramsSecond.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
        paramsSecond.append("code_verifier", verifier);
        // console.log(CLIENT_ID, '|', code, verifier)
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
            // setIsLoggedIn(true);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const logout = () => {
        console.log('logout has been called')
        // setToken("")
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("access_token")
        window.location = import.meta.env.VITE_HOME_URI
        setTopItems([]);
        setIsLoggedIn(false);
    }


    async function redirectToAuthCodeFlow(clientId) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);
    
        localStorage.setItem("verifier", verifier);
    
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
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

    const login = async() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) {
            redirectToAuthCodeFlow(CLIENT_ID);
        } else {
            await getAccessToken(CLIENT_ID, code);
        }
    }

    return (
        <div className="App">
            <NavBar isLoggedIn={isLoggedIn} logout={logout} />
            { isLoggedIn ?
                <Main topItems={topItems} setTopItems={setTopItems} />
            : 
                <Login login={login} />
            }
        </div>
    );
}

export default App