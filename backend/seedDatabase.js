import 'dotenv/config';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

export default async function seedDatabase() {
    const promise = new Promise((resolve, reject) => {
        const db = new sqlite3.Database('../database/myapp.sqlite3', async (err) => {
            if (err) {
                console.error(err);
            } else {
                try {
                    await dropUsers(db);
                    await createUsers(db);
                    const pwH = await hashPassword("hardpassword");
                    //comparePassword("hardpassword", pwH);
                    console.log("password: hardpassword");
                    await insertUsers(db, "master", "Master Account", pwH);
                    await showUsers(db);
                    resolve(true);
                } catch (err) {
                    console.error(err);
                    reject(false);
                }
            }
        });
    });
    return promise;
}

//seedDatabase();

async function hashPassword(password) {
    const promise = new Promise((resolve, reject) => {
        bcrypt.hash(password + process.env.SECRET_KEY, Number(process.env.SALT_ROUNDS), (err, hash) => {
            if (err)
                reject(err);
            else
                resolve(hash);
        });
    });
    return promise;
}

function comparePassword(password, hash) {
    bcrypt.compare(password + process.env.SECRET_KEY, hash, (err, result) => console.log(result));
}

async function dropUsers(db) {
    const promise = new Promise((resolve, reject) => {
        db.run("DROP TABLE IF EXISTS users;", [], (err) => {
            if (err) {
                console.error(err);
                reject();
            } else
                resolve();
        });
    });
    return promise;
}

async function createUsers(db) {
    const promise = new Promise((resolve, reject) => {
        db.run("CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT, password TEXT);", [], (err) => {
            if (err) {
                console.error(err);
                reject();
            } else
                resolve();
        });
    });
    return promise;
}

async function insertUsers(db, id, name, passowrd) {
    const promise = new Promise((resolve, reject) => {
        db.run("INSERT INTO users(id, name, password) VALUES(?, ?, ?);", [id, name, passowrd], (err) => {
            if (err) {
                console.error(err);
                reject();
            } else
                resolve();
        });
    });
    return promise;
}

async function showUsers(db) {
    const promise = new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, rows) => {
            if (rows && err == null) {
                console.log(rows);
                resolve();
            } else {
                console.error(err);
                reject();
            }
        });
    });
    return promise;
}