import {getPublicKey} from "nostr-tools";
import {getSettings} from "../processCommunication/settings";

// export let userNpub = "npub16lsc8wlh6cwkp0d3txkfyh6aea736jymqcm3wc3w5jsz4gmwlxaqx4dhqx"
let userSecretKey
let userPubKey

export async function loadKeys() {
    userSecretKey = await getSettings()
    userPubKey = getPublicKey(userSecretKey)
}

export function getUserSecretKey() {
    return userSecretKey
}

export function getUserPubKey() {
    return userPubKey
}



