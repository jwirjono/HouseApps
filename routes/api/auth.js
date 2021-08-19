const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');
 
// @route GET api/auth
// @desc Test Route
// @access Public

//Tambahin auth udah bikin ini aman
router.get('/',auth,async (req,res) => {
    try{
        //leave password(-password)
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/auth
// @desc Auntheticate User & Get Token
// @access Public

router.post('/',[
    check('email','Please insert a valid email').isEmail(),
    check('password','Password Required').exists()
],
async (req,res) =>{

    
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }
    
    //pull variable from body
    const {email,password}  = req.body;

    try{
        //harusnya itu email : email cuman karena variable sama bisa
        let user = await User.findOne({email});
    //See if user exists
    if(!user){
        //invalid credential same for security reason
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid Credential'}]});
    }

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