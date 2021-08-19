const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');
 
const User = require('../../models/User');

// @route POST api/users
// @desc Register User
// @access Public


router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Please insert a valid email').isEmail(),
    check('password','Please enter password with 6+').isLength({min:6})
],
async (req,res) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    
    //pull variable from body
    const {name,email,password}  = req.body;

    try{
        //harusnya itu email : email cuman karena variable sama bisa
        let user = await User.findOne({email});
        
    //See if user exists
    if(user){
        //return wajib
        return res.status(400).json({errors:[{msg:'User already exists'}]});
    }

    //Get users gravatar
    const avatar = gravatar.url(email,{
        //size
        s:'200',
        //rating PG
        r:'pg',
        //d ?
        d:'mm'
    })


    user = new User({
        name,
        email,
        avatar,
        password
    });

    //Encrypt password
    const passSalt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password,passSalt);

    console.log(user.password);
    //save will give back promise, will give back id
    await user.save();

    //return jsonweb token
    //json webtoken encrypt json data
    const payload = {
        user : {
            id: user.id
        }
    }

    jwt.sign(payload,
        config.get('jwtSecret'),
        //in seconds
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token});
        }
    );

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

module.exports = router;