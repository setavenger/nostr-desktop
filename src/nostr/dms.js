import {generatePrivateKey, getPublicKey, nip04, nip19} from "nostr-tools";
import {getUserPubKey, getUserSecretKey} from "../settings/user";
import {sendEvent} from "../processCommunication/events.js";

let dmPartners = []
let processedEvents = []

export async function processDmEvents(event) {
    const isInArray = processedEvents.includes(event.id);
    if (isInArray) {
        return
    } else {
        processedEvents = [...processedEvents, event.id]
    }
    let plaintext
    let partner

    // console.log(event)
    let receiver = event.tags.find(([k, v]) => k === 'p' && v && v !== '')[1]

    if (event.pubkey === getUserPubKey()) {
        plaintext = await nip04.decrypt(getUserSecretKey(), receiver, event.content)
        partner = receiver
    } else {
        plaintext = await nip04.decrypt(getUserSecretKey(), event.pubkey, event.content)
        partner = event.pubkey
    }

    // console.log(plaintext)
    return {
        partner: partner,
        pubkey: event.pubkey,
        message: plaintext
    }
}

export function addToDMPartners(partner) {
    // console.log(dmPartners)
    if (partner.pubkey === getUserPubKey()) {
        return dmPartners
    }
    let exists = dmPartners.some(p => p.pubkey === partner.pubkey && p.lastInteraction === p.lastInteraction);
    // const isInArray = dmPartners.includes(partner);
    if (exists) {
        return dmPartners
    } else {
        dmPartners = [...dmPartners, partner]
        return dmPartners
    }
}

export async function sendDM(pubkey, message) {
    console.log(`sending to ${pubkey}`)
    let ciphertext = await nip04.encrypt(getUserSecretKey(), pubkey, message)

    let event = {
        kind: 4,
        pubkey: getUserPubKey(),
        tags: [['p', pubkey]],
        content: ciphertext,
        created_at: Math.floor(Date.now() / 1000),
    }

    sendEvent(event)

}


