var router = require('express').Router();
var mongoose = require('mongoose')

var User = mongoose.model('User');
var Allocations = mongoose.model('Allocations');
var Fulfillment = mongoose.model('Fulfillments');
var Candidates = mongoose.model('Candidate');
var Requirements = mongoose.model('Requirements');
var Noti = mongoose.model('Noti')


const advUser = (user)=>{
  if(user.role === 'Admin'){
    user.isAdmin = true;
  }
  if(user.role === 'Client'){
    user.isClient = true;
  }
  if(user.role === 'Team Leader'){
    user.isTL = true;
  }
  if(user.role === 'Recruiter'){
    user.isRecruiter = true;
  }
  if(user.role === 'Manager'){
    user.isManager = true;
  }
    return user;
  };
  
  
  router.get('/', (req, res) => {
    

    var reject,pending,success,all,usersAll,noti=0;

    if(req.session.user) {
      
      Noti.find({}, (err, user) => {
        noti = user;
      })

      Requirements.countDocuments({}, (err, count) => {
        all=count;
      });
      Requirements.countDocuments({status:'selected'}, (err, count) => {
        success=count;
      });
      Requirements.countDocuments({status:'closed'}, (err, count) => {
        reject=count;
      });
      Requirements.countDocuments({status:'pending'}, (err, count) => {
        pending=count;
      });
      User.find({}, (err, users) => {
        usersAll = users;
      });
      Requirements.countDocuments({}, (err, count) => {
        Requirements.countDocuments({}, (err, count) => {
        return res.render('index',{'user': advUser(req.session.user),'all':all,'success':success,'reject':reject,'pending':pending,'users':usersAll,'noti':noti});
      }); });
     
    }else{
      return res.render('login')
  }

    
});


   
 
  
  router.get('/login', (req, res) => {
      return res.render('login')
  });
  
  router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email, password: password}, function(err, user){
      if(err){ 
        return res.render('login',{"error":"Invalid Email or Password"});
      }
      if(user){
        req.session.user = user;
        return res.redirect('/');
      }
    });
  });
  
  router.get('/register', (req, res) => {
    return res.render('register')
  });
  
  router.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var company = req.body.company;
    var role = 'Admin';
    var user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.company = company;
    user.save(function(err, user){
      if(err){
        return res.render('login',{"error":"Email already exists"});
      }
      if(user){
        return res.render('register',{"success":"Added Success"});
      }
    });
  });
  
  router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.render('login')
  });

  router.get('/candidates', (req, res) => {
    if(!req.session.user){
      return res.redirect('/login');
  }
    candidates = Candidates.find({}, function(err, candidates){
      if(err){
        return res.render('candidates',{"error":"No Candidates"});
      }
      if(candidates){
        return res.render('candidates',{"candidates":candidates,'user': advUser(req.session.user)});
      }
    });
  });

  router.get('/candidates', (req, res) => {
    if(!req.session.user){
      return res.redirect('/login');
  }
    candidates = Candidates.find({}, function(err, candidates){
      if(err){
        return res.render('candidates',{"error":"No Candidates"});
      }
      if(candidates){
        return res.render('candidates',{"candidates":candidates,'user': advUser(req.session.user)});
      }
    });
  });
  
module.exports = router;