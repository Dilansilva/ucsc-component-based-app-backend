const express = require('express')

const cors=require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("./User");

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const port = 3000
const url = "mongodb+srv://kasper:Kasper%402023@cluster0.r4hjwp2.mongodb.net/?retryWrites=true&w=majority"

const corsOptions ={
   origin:'*', 
   credentials:true,     
   optionSuccessStatus:200,
}

async function connect() {
    try{
        await mongoose.connect(url);
        console.log("Connected to database");
    } catch(e) {
        console.log("Database Error:::",e);
    }
}


connect();

app.use(cors(corsOptions))

app.post('/signin', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const user = User.create({username:req.body.username,password:hashedPassword});
        res.status(201).send();
    }catch(e){
        console.log("Error",e);
        res.status(500).send()
    }
})

app.post('/login', async (req, res) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        console.log(hashedPassword)
        res.status(201).send();
    }catch{
        res.status(500).send()
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})