const {getPublicKey} = require('nostr-tools');
const fs = require('fs');
const os = require('os');
const path = require('path');

const homeDir = os.homedir();

let userSecretKey
let userPubKey

function getData() {
    return new Promise((resolve, reject) => {
        const filePath = path.join(homeDir, '/.nostr/config.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const json = JSON.parse(data);
                    userSecretKey = json["private_key"]
                    userPubKey = getPublicKey(userSecretKey)
                    resolve();
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            }
        });
    });
}


function getUserSecretKey() {
    return userSecretKey
}

function getUserPubKey() {
    return userPubKey
}


module.exports = {getData, userSecretKey, userPubKey, getUserSecretKey, getUserPubKey}