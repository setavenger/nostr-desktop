import {getEventHash, relayInit, signEvent} from "nostr-tools";
import {getUserSecretKey} from "../settings/user";

export let relayURLsStandard = [
    "wss://nostr.snblago.com",
    "wss://relay.damus.io",
    "wss://relay.nostr.info",
    "wss://relay.snort.social",
    "wss://nostr.com.de",
    // "wss://nostr.onsats.org",
    "wss://nostr-pub.semisol.dev",
]

let relays = [];
let relayURLS = [];

(function load() {
    // const localRelays = localStorage.getItem('nostr-anzeigen-relays')
    // if (localRelays === null) {
    //     relayURLS = relayURLsStandard
    //     localStorage.setItem('nostr-anzeigen-relays', JSON.stringify(relayURLS));
    // } else {
    //     relayURLS = JSON.parse(localRelays)
    // }
    relayURLS = relayURLsStandard
})();

// relayURLS.map((relayURL) => {
//     const relay = relayInit(relayURL)
//     relay.connect().then(() => {
//
//     }).catch(err => console.log(err))
//
//
//     relay.on('connect', () => {
//         console.log(`connected to ${relay.url}`)
//     })
//     relay.on('error', () => {
//         console.log(`failed to connect to ${relay.url}`)
//     })
//     relays = [...relays, relay]
// })


export function removeRelay(url) {

    const findById = urls => relays.find(function (relay) {
        return relay.url !== urls;
    });
    const relay = findById(url)
    relay.close() //todo close connection as well

    const index = relayURLS.indexOf(url);
    if (index > -1) { // only splice array when item is found
        relayURLS.splice(index, 1); // 2nd parameter means remove one item only
    }

    relays = relays.filter(function (obj) {
        return obj.url !== url;
    });


    localStorage.setItem('nostr-anzeigen-relays', JSON.stringify(relayURLS));

    return relays
}

export function newRelay(url) {
    relayURLS = [...relayURLS, url]
    const relay = relayInit(url)
    relay.connect().then(() => {
    })

    relay.on('connect', () => {
        console.log(`connected to ${relay.url}`)
    })
    relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
    })

    relays = [...relays, relay]

    localStorage.setItem('nostr-anzeigen-relays', JSON.stringify(relayURLS));

    return relays
}


export function sendEvent(event) {
    event.id = getEventHash(event)
    event.sig = signEvent(event, getUserSecretKey())

    relays.map((relay) => {
        let pub = relay.publish(event)
        pub.on('ok', () => {
            console.log(`${relay.url} has accepted our event`)
        })
        pub.on('seen', () => {
            console.log(`we saw the event on ${relay.url}`)
        })
        pub.on('failed', reason => {
            console.log(`failed to publish to ${relay.url}: ${reason}`)
        })
    })
}


export default relays
