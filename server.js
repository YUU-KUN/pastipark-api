import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

import db from './configs/database.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
(async () => {
    await db.sync({ alter: true });
    console.log('DB synced');
})();

// set body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.static('public'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET
}));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(routes)


app.listen(PORT, () => {
    console.log(`Server running on ${host}:${PORT}`)
})