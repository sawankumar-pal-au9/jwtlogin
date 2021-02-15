const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

//get allusers
router.get('/users', (req,res) => {
    User.find({},{password:0}, (err,data) => {
        if(err) throw err;
        return res.status(200).send(data);
    });
});

//register
router.post('/register', (req,res) => {
    User.findOne({email:req.body.email}, (err,data) => {
        if(err) throw err;
        if(data) return res.send("Email Already Exist!");
        else {
            let hashedPassword = bcrypt.hashSync(req.body.password,8);

            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role?req.body.role:"User",
                isActive: true
            }, (err,data) => {
                if(err) throw err;
                return res.status(200).send("User Registered Succesfully!");
            });
        }
    });
});

//login
router.post('/login', (req,res) => {         
    User.findOne({email:req.body.email}, (err,data) => {
        if(err) return res.status(500).send({auth:false, "error": "Error While Login."});
        if(!data) return res.status(500  ).send({auth:false, "error": "No User Found With This Email. Please Register First!"});
        else {
            var passwordValid = bcrypt.compareSync(req.body.password, data.password);
            if(!passwordValid) return res.status(500).send({auth:false, "error": "Invalid Password."});
            else {
                var token = jwt.sign({id:data._id}, config.secret, {expiresIn:86400});
                return res.status(200).send({auth:true, token:token});
            }
        }
    });
});

//user profile
router.get('/userinfo', (req,res) => {
    let token = req.headers['x-access-token'];
    if(!token) return res.status(500).send({auth:false, "error": "No Token Provided"});
    else {
        jwt.verify(token, config.secret, (err,result) => {
            if(err) return res.status(500).send({auth:false, "error": "Invalid Token"});
            User.findById(result.id, (err,data) => {
                if(err) throw err;
                return res.status(200).send(data);
            });
        });
    }
});

module.exports = router;