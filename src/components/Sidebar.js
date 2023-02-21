import {nip19} from "nostr-tools";
import {useEffect} from "react";

export const SideBar = ({partners, setActiveConvo, activeConvo, updater, setUpdater}) => {

    useEffect(() => {
        // messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }, [updater]);

    return (
        <div className="w-64 bg-gray-200 h-screen p-4">
            <h2 className="text-xl font-bold mb-4">DM Partners</h2>
            <ul className="list-none">
                {partners.map((partner, index) => (
                    <User key={index} partner={partner} setActiveConvo={setActiveConvo} activeConvo={activeConvo} setUpdater={setUpdater}/>
                ))}
            </ul>
        </div>
    );
};


const User = ({partner, setActiveConvo, activeConvo, setUpdater}) => {

    function selectConversation() {
        setActiveConvo(partner.pubkey)
        setUpdater(Date.now())
    }

    return (
        <li
            className={`mb-2 ${activeConvo === partner.pubkey ? "bg-purple-700 text-white" : ""} hover:bg-purple-400 p-2 cursor-pointer rounded-full`}
            onClick={selectConversation}
        >
            <a href="#" className="">{nip19.npubEncode(partner.pubkey).slice(0, 16)}</a>
        </li>
    )
}