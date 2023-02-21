require('./settings/user')

const {spawn} = require('child_process');
const {app, BrowserWindow, Notification, Menu, nativeImage, Tray} = require('electron')
const {ipcMain} = require('electron')
const path = require('path');
const {eventsAll} = require("./nostr/events");
const {getUserSecretKey, getUserPubKey, getData} = require("./settings/user");

require('websocket-polyfill')
const {startRelays, sendEvent} = require("./nostr/relays");
// const {createDB} = require("./database/db");


let win = null
let tray = null

function createTray() {
    const icon = path.join(__dirname, 'nostr-electron-tray-icon.png') // required.
    const trayicon = nativeImage.createFromPath(icon)
    tray = new Tray(trayicon.resize({width: 16}))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                createWindow()
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit() // actually quit the app.
            }
        },
    ])

    tray.setContextMenu(contextMenu)
}

async function createWindow() {
    if (!tray) { // if tray hasn't been created already.
        createTray()
    }

    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //load the index.html from a url
    if (app.isPackaged) {
        win.loadFile('./dist/index.html'); // prod
    } else {
        win.loadFile('./dist/index.html'); // dev
    }

    getData().then(() => {
        startRelays()
    })
    // createDB(app)
    // Open the DevTools.
    // win.webContents.openDevTools()
}


app.whenReady().then(createWindow)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // app.quit()
        app.dock.hide()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// Listen for the 'show-notification' message
ipcMain.on('show-notification', (event, args) => {
    new Notification(args).show()
    console.log(args)
})

ipcMain.on('get-data', (event, arg) => {
    event.reply('get-data-reply', eventsAll());
});

ipcMain.on('get-settings', (event, arg) => {
    event.reply('get-settings-reply', getUserSecretKey());
});

ipcMain.on('send-event', (event, arg) => {
    sendEvent(arg)
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.