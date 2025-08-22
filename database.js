const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "data.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        const createTables = `
            CREATE TABLE IF NOT EXISTS concerns (
                id INTEGER PRIMARY KEY,
                name TEXT UNIQUE
            );

            CREATE TABLE IF NOT EXISTS concern_synonyms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                concern_id INTEGER,
                synonym TEXT,
                FOREIGN KEY(concern_id) REFERENCES concerns(id)
            );

            CREATE TABLE IF NOT EXISTS treatments (
                id INTEGER PRIMARY KEY,
                name TEXT,
                invasiveness TEXT CHECK(invasiveness IN ('invasive','non-invasive','minimally-invasive')),
                typical_downtime_days INTEGER
            );
            CREATE TABLE IF NOT EXISTS concern_treatments (
                concern_id INTEGER,
                treatment_id INTEGER,
                FOREIGN KEY(concern_id) REFERENCES concerns(id),
                FOREIGN KEY(treatment_id) REFERENCES treatments(id),
                PRIMARY KEY (concern_id, treatment_id)
            );
            CREATE TABLE IF NOT EXISTS packages (
                id INTEGER PRIMARY KEY,
                clinic_name TEXT,
                package_name TEXT,
                treatment_id INTEGER,
                price INTEGER,
                highlights TEXT,
                FOREIGN KEY(treatment_id) REFERENCES treatments(id)
            );
        `;
        db.exec(createTables, (err) => {
            if (err) {
                console.error("Error creating tables:", err);
            }
        });
    }
});

module.exports = db;