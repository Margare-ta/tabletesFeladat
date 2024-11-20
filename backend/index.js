import express from "express";
import cors from 'cors';
import mysql from 'mysql2';

const app = express();

app.use(cors())

app.use(express.json());

const db = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'webbolt' 
}).promise();

app.get('/tablets', async (req, res) => {
    
    try {
        const temp = await db.query('SELECT * FROM tablets');
        const rows = temp[0];
        const fields = temp[1];
        res.status(200).json(rows);
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post('/tablets', async (req, res) => {
    try {
        let tablet = [req.body.name, req.body.price, req.body.year, req.body.ramSize, req.body.cpucores];

        if (tablet[0].length < 1) {
            return res.status(400).json({ error: "Tablet's name must have at least 1 character" });
        }
        if (parseInt(tablet[1]) < 1) {
            return res.status(400).json({ error: "Tablet's price must be greater than 0" });
        }
        if (parseInt(tablet[2]) < 2001) {
            return res.status(400).json({ error: "Tablet's publication's year must be over 2001" });
        }
        if (parseInt(tablet[3]) > 16 || parseInt(tablet[3]) < 2){
            return res.status(400).json({ error: "The RAM must be at least 2 and lower then 16"})
        }
        if (parseInt(tablet[4]) > 16 || parseInt(tablet[4]) < 2){
            return res.status(400).json({ error: "The CPU cores's number must be at least 1 and lower then 16"})
        }

        const [rows, fields] = await db.query('INSERT INTO tablets (name, price, year, ramSize, cpucores) VALUES (?,?,?)', tablet);
        res.status(200).json({ message: 'Tablet successfully added!'});


    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.delete('/tablets/:tabletId', async (req, res) => {
    try {
        let tabletId = parseInt(req.params.Id);
        const [rows, fields] = await db.query('DELETE FROM tablets WHERE id =?', [tabletId]);
        if (rows.length === 0) {
            res.status(404).json({ error: "Tablet not found" });
        } else {
            res.status(200).json({ message: "Tablet successfully removed" });
        }
 
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/tablets/:tabletId', async (req, res) => {
    try {
        let tabletId = parseInt(req.params.Id);
        const [rows, fields] = await db.query('SELECT id, name, price, year, ramSize, cpucores FROM tablets WHERE id =?', [tabletId]);
        if (rows.length == 1){
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({error: 'There is no tablets with this id.'});
        }
    } catch (error) {
        console.error(`Error retrieving tablets ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.listen(3000);
