
export function getSettings() {
    return new Promise((resolve, reject) => {
        window.myAPI.send('get-settings');
        window.myAPI.receive('get-settings-reply', (data) => {
            resolve(data);
        });
    });
}