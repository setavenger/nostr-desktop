import logo from './logo.svg';
import './App.css';
import {ChatApp} from "./components/ChatApp";
import relays from "./nostr/relays"
import {loadKeys} from "./settings/user";
import {useEffect, useState} from "react";

function App() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {

    }, [])
    loadKeys().then(() => {
        setLoading(false)
    })
    return (
        <div className="App">
            {!loading && <ChatApp relays={relays}/>}
            {loading && <div>Loading...</div>}

        </div>
    );
}

export default App;
