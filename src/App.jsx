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

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("code")) {
            const code = params.get("code");
            getAccessToken(CLIENT_ID, code);
        } else {
            redirectToAuthCodeFlow(CLIENT_ID);
        }
    }, []);
    
    async function getAccessToken(CLIENT_ID, code) {
        const verifier = localStorage.getItem("verifier");
        const paramsSecond = new URLSearchParams();
        
        paramsSecond.append("client_id", CLIENT_ID);
        paramsSecond.append("grant_type", "authorization_code");
        paramsSecond.append("code", code);
        paramsSecond.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
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
            setIsLoggedIn(true);
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
    }

    const logout = () => {
        // setToken("")
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("access_token")
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

    function login() {
        redirectToAuthCodeFlow(CLIENT_ID);
        getAccessToken(CLIENT_ID, code);
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