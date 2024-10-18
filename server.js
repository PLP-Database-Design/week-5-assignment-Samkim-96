//initialize dependences

const express= require("express");
const app= express();
const mysql= require('mysql2');
const dotenv= require('dotenv');
const cors= require('cors');
const { Server } = require("net");

app.use(express.json());
app.use(cors());
dotenv.config();

//connect to the database

const db= mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Check if db connection works
db.connect((err)=>{
    //no wedding today
    if(err) return console.log("error connecting to the mysql db");
    //yes connected
    console.log("connected to mysql successfully as id:", db.threadId)

// Your code goes here
// Get Method Example
app.set('view engine','ejs');
app.set('views', __dirname + '/views');

// Data is the name of file for inside views folder
app.get('/data', (req,res) =>{
    // Retrieve data from database
    db.query('SELECT * FROM patients',(err, results) =>{
        if (err){
            console.error(err);
            res.status(500).send('Error retrieving data');
        }else{
            // Display the records to the browser
            res.render('data', {results: results});
        }
    });
});

    app.listen(process.env.PORT, () =>{
console.log(`Server listening on port ${process.env.PORT}`);
//Send a message to the browser
console.log('Sending message to the browser..');
app.get('/', (req,res) =>{
    res.send('server started successfully!')
});
    });
});