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
// Question 1
app.get('/patients', (req,res) =>{
    const sql ='SELECT patient_id, first_name,last_name, date_of_birth FROM patients';

    db.query(sql, (err, results) =>{
        if(err) {
            return res.status(500).send(err);
        }
        res.json(results);
    })
});

// Question 2

// Create a GET endpoint that displays all providers with their:
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Question 3
// Create a GET endpoint that retrieves all patients by their first name
app.get('/patients', (req, res) => {
    const { first_name } = req.query; 
    
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(sql, [first_name], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});



// // Question 4
// // Create a GET endpoint that retrieves all providers by their specialty
// Specify parameters on the path
app.get('/providers_specialty/:specialty', (req,res) =>{
    const {specialty} = req.params;
    console.log({specialty});
    const sql ='SELECT first_name, last_name, provider_specialty  FROM providers WHERE provider_specialty =?'

    db.query(sql,[specialty], (err, results) => {
        if(err) {
            return res.status(500).send(err);
        } 
        res.json(results);
});
});

// Qustion4 4
// GET endpoint to retrieve providers by their specialty
// using query parameters 
app.get('/providers', (req, res) => {
    const { specialty } = req.query; 
    
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
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