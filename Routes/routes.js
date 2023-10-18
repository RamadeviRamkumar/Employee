let router = require('express').Router();
const Cryptr = require('cryptr');
var cryptr = new Cryptr("Guru")

router.get('/api',function(req,res){
    res.json({
        status : 'API Works',
        message : 'Welcome to User Signin/Signup API'
    });
});

const user_Signup = require('../Model/Models');

router.post('/signin',(req,res) => {
    user_Signup.findOne({ email : req.body.email }, function(err,user){
        
        if (user === null) {
            return res.status(400).send({
                message : "The given User cannot be found."
            })
        }
        else {
            var dec = cryptr.decrypt(user.password);
//             console.log(req.body.password);
//             console.log(req.body.password);
            var enc = cryptr.encrypt(req.body.password);
            //  var dec = cryptr.decrypt(enc);
            user.save(function (err){
            if (req.body.password === dec) {
                return res.status(201).send({
                    message : "Signin Successfully",
                    data: {
                        firstName : req.body.firstName,
                        lastName  : req.body.lastName,
                        userName  : req.body.userName,
                        // email     : req.body.email,
                        mobile    : req.body.mobile,
                        password  : enc
                    }
                })
            }
            else {
                return res.status(400).send({
                    message : "Password incorrect"
                });
            }
        })
        }
        
    })    
    
});
const emailCount = require('../Model/Models');

    router.post('/register',async (req,callback) => {
        var cryptr = new Cryptr('Guru');
        var enc = cryptr.encrypt(req.body.password);
        var dec = cryptr.decrypt(enc);
    
        var user = new user_Signup();
        user.firstName = req.body.firstName;
        user.lastName  = req.body.lastName;
        user.userName  = req.body.userName;
        user.email     = req.body.email;
        user.mobile    = req.body.mobile;
        user.password  = enc;
        mobile = user.mobile
       await user.save(function (err) {              
                if(err)        
                    callback.json("User already signup by using this Email")    
                //  else {
                    // if(mobile.toString().length!=10){
                    //     callback.json("User mobile invalid")                 
                    // }
                else {                    
                callback.json({
                message : "*** New user signup ***",
                 data: {
                    firstName : req.body.firstName,
                    lastName  : req.body.lastName,
                    userName  : req.body.userName,
                    email     : req.body.email,
                    mobile    : req.body.mobile,
                }
                })            
            }
        })       
        }) 

var Controller = require('../Controller/Controller.js');
router.route('/users')
.get(Controller.index)

// router.route('/signup')
//       .post(Controller.add);

router.route('/users/:email')
.get(Controller.view)
.patch(Controller.update)
.put(Controller.update)
.delete(Controller.Delete);

module.exports = router;
