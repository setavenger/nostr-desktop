// const {insertNewEvent} = require("../database/db");
const {Notification} = require("electron");
const {nip19} = require("nostr-tools");
const {getUserPubKey} = require("../settings/user");
let events = []
let processedEvents = []

let lastNotification = Date.now()

function addEvent(event) {
    const isInArray = processedEvents.includes(event.id);
    if (isInArray) {
        return
    } else {
        processedEvents = [...processedEvents, event.id]
        // insertNewEvent(event).then(r => {console.log(r)})
    }
    events = [...events, event]
    if (event.pubkey !== getUserPubKey()) {
        if (Date.now() - lastNotification > (3 * 1000)) {
            new Notification({
                title: 'New Message', body: `New message from ${nip19.npubEncode(event.pubkey).slice(0, 16)}`,
            }).show()
            lastNotification = Date.now()
            console.log("made notification")
        }
    }
    // console.log(events.length)
}

function eventsAll() {
    return events
}


module.exports = {addEvent, eventsAll}