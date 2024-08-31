const express = require('express')
const app = express();

const db = require("./db.js");
const PORT = process.env.PORT || 3003;

const  cookieParser = require('cookie-parser');
app.use(cookieParser())

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/',function(req, res) {
    res.json({message : 'E-commerce Project'})
});

app.listen(3003,()=>{
    console.log("PORT 3003 is working")
})

// const userRoutes = );
app.use('/user',require('./routes/userRouter.js'));
