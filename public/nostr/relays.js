require('../settings/user')
const {getEventHash, relayInit, signEvent, nip19} = require('nostr-tools');
const {getUserSecretKey, getUserPubKey} = require('../settings/user');
const {addEvent} = require("./events");
const {Notification} = require("electron");


let relayURLsStandard = [
    "wss://nostr-pub.wellorder.net",
    "wss://nostr.bitcoiner.social",
    "wss://nostr.snblago.com",
    "wss://relay.damus.io",
    "wss://relay.nostr.info",
    "wss://relay.snort.social",
    "wss://nostr.com.de",
    "wss://nostr.onsats.org",
    "wss://nostr-pub.semisol.dev",
    "wss://nostr-relay.wlvs.space",
    "wss://nostr.zebedee.cloud",
    "wss://nostr.walletofsatoshi.com",
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



function startRelays() {
    const connectRelay = (relayURL) => {
        const relay = relayInit(relayURL);

        relay.connect()
            .then(() => {
                console.log(`connected to ${relay.url}`);
            })
            .catch((err) => {
                console.log(`ConnectionError -  ${relay.url}:`, err)
                // console.log(`failed to connect to ${relay.url}: ${err}`);
                // setTimeout(() => connectRelay(relayURL), 5000); // retry in 5 seconds
            });

        relay.on("error", (err) => {
            console.log(`error on ${relay.url}: ${err}`);
        });

        relay.on("disconnect", () => {
            console.log(`disconnected from ${relay.url}`);
            setTimeout(() => connectRelay(relayURL), 10000); // retry in 5 seconds
        });

        // start dm subscriptions
        // dms reaching us
        let sub = relay.sub([{
            kinds: [4], "#p": [getUserPubKey()]
        }])
        // dms sent by us
        let sub2 = relay.sub([{
            authors: [getUserPubKey()], kinds: [4],
        }])
        sub.on('event', (event) => {
            addEvent(event)
        })
        sub2.on('event', (event) => {
            addEvent(event)
        })
        relays = [...relays, relay]
    };

    relayURLS.forEach((relayURL) => {
        connectRelay(relayURL);
    });
}


// function startRelays() {
//     relayURLS.map((relayURL) => {
//         const relay = relayInit(relayURL)
//         relay.connect().then(() => {
//
//         }).catch(err => console.log(err))
//
//         relay.on('connect', () => {
//             console.log(`connected to ${relay.url}`)
//         })
//         relay.on('error', () => {
//             console.log(`failed to connect to ${relay.url}`)
//         })
//         relay.on('disconnect', () => {
//             console.log(`disconnected from ${relay.url}`)
//         })
//
//         // start dm subscriptions
//         // dms reaching us
//         let sub = relay.sub([
//             {
//                 kinds: [4],
//                 "#p": [getUserPubKey()]
//             }
//         ])
//         // dms sent by us
//         let sub2 = relay.sub([
//             {
//                 authors: [getUserPubKey()],
//                 kinds: [4],
//             }
//         ])
//         sub.on('event', (event) => {
//             addEvent(event)
//             if (Date.now() - lastNotification > (3 * 1000)) {
//                 new Notification({
//                     title: 'New Message',
//                     body: `New message from ${nip19.npubEncode(event.pubkey).slice(0, 16)}`,
//                 }).show()
//                 lastNotification = Date.now()
//                 console.log("made notification")
//             }
//         })
//         sub2.on('event', (event) => {
//             addEvent(event)
//         })
//         relays = [...relays, relay]
//     })
// }

function removeRelay(url) {

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

function newRelay(url) {
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

function sendEvent(event) {
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


module.exports = {removeRelay, newRelay, sendEvent, startRelays}