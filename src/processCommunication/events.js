export function getData() {
    return new Promise((resolve, reject) => {
        window.myAPI.send('get-data');
        window.myAPI.receive('get-data-reply', (data) => {
            // console.log(data)
            resolve(data);
        });
    });
}

export function sendEvent(event) {
    window.myAPI.send('send-event', event);
}

