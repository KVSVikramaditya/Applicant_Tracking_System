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
 

  router.get('/submission', (req, res) => {
    if(!req.session.user){
      return res.redirect('/login');
    }
    var level = "2";
    if(req.session.user.role == 'Manager'){ level='3';}
    if(req.session.user.role == 'Client'){ level='4';}
    if(req.query.pass){

        Fulfillment.findOneAndUpdate({_id:req.query.pass},{interviewlevel:level},(err,fulfillment)=>{

        });
    }
    if(req.query.fail){

        Fulfillment.findOneAndUpdate({_id:req.query.fail},{status:'rejected',interviewlevel:"0"},(err,fulfillment)=>{

        });
    }
    if(req.session.user.role=='Team Leader'){
    
        Allocations.find({toplevel:req.session.user.email}, function(err, users){
          var data = [];
          users.forEach(function(user){data.push(user.sublevel)});
    
            Allocations.find({toplevel:{$in: data}}, function(err, users){
              var data = [];
              users.forEach(function(user){data.push(user.sublevel)});
              Requirements.find({client:{$in: data}}, function(err, AcutalRequirements){
                var data = [];
                AcutalRequirements.forEach(function(user){data.push(user._id)});
                  Fulfillment.find({requirement:{$in: data},interviewlevel:'1'}, function(err, fulfill){
                    return res.render('submissions',{'fulfill':fulfill,"users": AcutalRequirements,'user': advUser(req.session.user)});
                  }
                  );
                 
              });
            });
        });
      }


      if(req.session.user.role=='Manager'){
    
        Allocations.find({toplevel:req.session.user.email}, function(err, users){
          var data = [];
          users.forEach(function(user){data.push(user.sublevel)});
              Requirements.find({client:{$in: data}}, function(err, AcutalRequirements){
                var data = [];
                AcutalRequirements.forEach(function(user){data.push(user._id)});
                  Fulfillment.find({requirement:{$in: data},interviewlevel:'2'}, function(err, fulfill){
                    return res.render('submissions',{'fulfill':fulfill,"users": AcutalRequirements,'user': advUser(req.session.user)});
                  }
                  );
                 
              });
           
        });
      }


      if(req.session.user.role=='Client'){
    

              Requirements.find({client:req.session.user.email}, function(err, AcutalRequirements){
                var data = [];
                AcutalRequirements.forEach(function(user){data.push(user._id)});
                  Fulfillment.find({requirement:{$in: data},interviewlevel:'3'}, function(err, fulfill){
                    return res.render('submissions',{'fulfill':fulfill,"users": AcutalRequirements,'user': advUser(req.session.user)});
                  }
                  );
                 
              });
           
       
      }



  });






module.exports = router;