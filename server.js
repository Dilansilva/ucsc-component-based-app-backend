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
        User.find({username:req.body.username}).then((data,err) => {
            if(err){
                res.status(500).send()
            } else {
                if(data[0]){
                    res.status(200).json({message:"existusername"})
                }else{
                    const salt = bcrypt.genSalt();
                        const hashPassword = bcrypt.hash(req.body.password.toString(),salt);
                            const user = User.create({username:req.body.username,password:hashPassword});
                                res.status(201).json({message:'usercreated'});
                }
            }
        })
    }catch(e){
        res.status(500).send()
    }
})

app.post('/login', async (req, res) => {
    try{
        User.find({username:req.body.username}).then((data,err) => {
            if(err){
                res.status(500).send()
            } else {
                if(data[0]){//if user exist
                    bcrypt.compare(req.body.password.toString(),data[0].password.toString())
                    .then((e) =>{
                        if(e){
                            res.status(200).json({message:"loginsucess"})
                        } else {
                            res.status(200).json({message:'wrongPassword'})
                        }
                    }).catch((e) => {
                        res.status(500).send()
                    })
                } else { //if user is not exist
                    res.status(201).json({message:"wrongUsername"})
                }
            }
        });
    }catch(e){
        res.status(500).send()
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})