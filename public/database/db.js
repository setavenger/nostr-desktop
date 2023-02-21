const path = require('path');
const Sequelize = require('sequelize');


let Event


function createDB(app) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'nostr-desktop-db.sqlite3');

    console.log("Path:", dbPath)

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath
    });

    Event = sequelize.define('event', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        pubkey: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.INTEGER
        },
        kind: {
            type: Sequelize.STRING
        },
        tags: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        sig: {
            type: Sequelize.STRING
        },
    });

    sequelize.sync().then(() => {
        console.log('Database and tables created');
    }).catch((err) => {
        console.error('Failed to create database and tables', err);
    });
}


async function insertNewEvent(args) {
    Event.findOrCreate({
        where: args
    }).then(() => {
        console.log("inserted a row")
    }).catch(err => console.log(err))
}


async function getAllEvents() {
    return await Event.findAll()
}


module.exports = {createDB, insertNewEvent, getAllEvents}