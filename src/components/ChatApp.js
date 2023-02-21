import {SideBar} from "./Sidebar.js"
import {ChatWindow} from "./ChatWindow.js"
import {useEffect, useState} from "react";
import {addToDMPartners, processDmEvents} from "../nostr/dms.js";
import {getUserPubKey, loadKeys} from "../settings/user";
import {getData} from "../processCommunication/events";


export const ChatApp = () => {

    const [messageList, setMessageList] = useState({})
    const [partners, setPartners] = useState([])
    const [activeConvo, setActiveConvo] = useState('')
    const [updater, setUpdater] = useState(0)

    const addMessage = (pubKey, newMessage) => {

        const newMessageList = messageList;

        // console.log(newMessageList[pubKey])
        if (newMessageList[pubKey] === undefined) {
            newMessageList[pubKey] = []
        }
        // console.log(pubKey, newMessage)
        newMessageList[pubKey] = [...newMessageList[pubKey], newMessage]
        // console.log(newMessageList)
        setMessageList(newMessageList);
        setUpdater(Date.now())
    };

    useEffect(() => {
        const interval = setInterval(() => {
            myFunction();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function myFunction() {
        getData().then(events => {
            // console.log(events)
            events.map(event => {
                processDmEvents(event)
                    .then((result) => {
                        if (result === undefined) {
                            return
                        }
                        // console.log(event)
                        setPartners(addToDMPartners({
                            pubkey: result.partner,
                            lastInteraction: event.created_at
                        }));

                        addMessage(result.partner, {
                            author: {
                                imageUrl: result.pubkey === getUserPubKey() ? "https://robohash.org/PMV.png?set=set1" : "https://robohash.org/PMV.png?set=set2",
                                pubkey: result.pubkey
                            },
                            text: result.message,
                            timestamp: event.created_at
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
        });

    }

    return (
        <div className="h-screen flex">
            <SideBar partners={partners} setActiveConvo={setActiveConvo} activeConvo={activeConvo} updater={updater} setUpdater={setUpdater}/>
            <ChatWindow messages={messageList} activeConvo={activeConvo} updater={updater}/>
        </div>
    );
};