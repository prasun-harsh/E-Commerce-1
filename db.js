const mongoose = require('mongoose');

require('dotenv').config();
//Define the MongoDB connection URL
const mongoURL = process.env.Mongo_url_local // Replace 'mydatabase' with your database

// Set up MongoDB connection
mongoose. connect (mongoURL,{
    // useNewUrlParser: true, 
    // useUnifiedTopology: true
})
//Get the default connection
// Mongoose maintains a default connection object representing the mongodb connection

const db = mongoose.connection;

// define Event listener
db.on('connected',()=>{
    console.log('Connected to MongoDB server');
});

db.on ('error', (err) =>{
    console.error ('MongoDB connection error:', err);
});

db. on('disconnected', () => {
    console. log ('MongoDB disconnected');
});

// export the database

module.exports = db;
