var router = require('express').Router();
var mongoose = require('mongoose')
var User = mongoose.model('User');
var Allocations = mongoose.model('Allocations');
var Fulfillment = mongoose.model('Fulfillments');
var Candidates = mongoose.model('Candidate');
var Requirements = mongoose.model('Requirements');
var Noti = mongoose.model('Noti')
var path = require('path');


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

router.get('/view-messages', (req, res) => {
  if(!req.session.user)
  {
    return res.redirect('/login');
  }
    candidates = Noti.find({}, function(err, candidates){
      if(err){
        return res.render('candidates',{"error":"No Candidates"});
      }
      if(candidates){
        return res.render('messages',{"noti":candidates,'user': advUser(req.session.user)});
      }
    });
  });
  

  router.get('/delete-message', (req, res) => {
    Noti.remove({'_id' : req.query.id}, function(err, candidates){
      if(candidates)
      {
        return res.redirect('/view-messages');
      }
    });
  });

  router.post('/add-message', (req, res) => {
    var heading = req.body.heading;
    var details = req.body.details;
    var noti = new Noti();
    noti.heading = heading;
    noti.details = details;
    noti.save(function(err, noti){
      if(err){
        return res.render('messages',{"error":"No Candidates"});
      }
      if(noti){
        return res.redirect('/view-messages');
      }
    });
  });
  
  router.get('/add-user', (req, res) => {
    if(!req.session.user){
      return redirect('/login')
    }

    User.find({}, function(err, users){
      if(err){
        return res.render('add-user',{"error":"No Users"});
      }
      if(users){
        return res.render('add-user',{"users":users,'user': advUser(req.session.user)});
      }
    });
  });

  router.post('/add-user', (req, res) => {
    if(!req.session.user){
      return redirect('/login')
    }
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var company = req.session.user.company;
    var role = req.body.role;
    var user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.company = company;
    user.save(function(err, user){
      if(err){
        return res.render('add-user',{"error":"Email already exists",'user': advUser(req.session.user)});
      }
      if(user){
        return res.render('add-user',{"success":"User Added",'user': advUser(req.session.user)});
      }
    });
  });


  router.get('/view-clients', (req, res) => {
    if(!req.session.user){
      return res.redirect('/login')
    }

    User.find({role:'Client'}, function(err, users){
      if(err){
        return res.render('view-clients',{"error":"No Users"});
      }
      if(users){
        return res.render('view-clients',{"users":users,'user': advUser(req.session.user)});
      }
    });
  });

  
  router.get('/remove-client', (req, res) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    User.remove({'_id' : req.query.id}, function(err, users){
        if(users) {
            return res.redirect('/view-clients');
        }
    }
    ); 
  });




  router.get('/view-manager', (req, res) => {
    if(!req.session.user){
        return res.redirect('/login');
    }
        User.find({role:'Manager'}, function(err, users){
            if(err){
              return res.render('view-clients',{"error":"No Users"});
            }
            if(users){
              return res.render('view-manager',{"users":users,'user': advUser(req.session.user)});
            }
          });
   
  });




  router.get('/view-manager-list', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/login');
    }
      var tl =[];
      User.find({role:'Team Leader'}, function(err, users){
            if(err){
                
            }
            if(users){
              tl=users;
            }
            });
      var assigner = req.query.assigner;
      User.find({role:'Manager'}, function(err, users){
          if(err){
            return res.render('view-clients',{"error":"No Users"});
          }
          if(users){
              Allocations.find({sublevel:assigner}, function(err, allocations){
                  if(err){
                      return res.render('view-manager',{"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                  }
                  if(allocations){
                      return res.render('view-manager',{"selected":assigner ,"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                  }
              });
          }
        });
});

router.get('/view-client-list', (req, res) => {
  if(!req.session.user) {
      return res.redirect('/login');
  }
    var tl =[];
    User.find({role:'Manager'}, function(err, users){
          if(err){
              
          }
          if(users){
            tl=users;
          }
          });
    var assigner = req.query.assigner;
    User.find({role:'Client'}, function(err, users){
        if(err){
          return res.render('view-clients',{"error":"No Users"});
        }
        if(users){
            Allocations.find({sublevel:assigner}, function(err, allocations){
                if(err){
                    return res.render('view-clients',{"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                }
                if(allocations){
                    return res.render('view-clients',{"selected":assigner ,"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                }
            });
        }
      });
});

router.get('/assign', (req, res) => {
    var from = req.query.from;
    var to = req.query.to;
    var aloc = new Allocations();
    aloc.sublevel = from;
    aloc.toplevel = to;

    aloc.save(function(err, aloc){
        if(err){
          
        }
        if(aloc){
            return res.redirect('/view-manager-list?assigner='+from);
        }
    });

   

});









router.get('/view-tl', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
      User.find({role:'Team Leader'}, function(err, users){
          if(err){
            return res.render('view-tl',{"error":"No Users"});
          }
          if(users){
            return res.render('view-tl',{"users":users,'user': advUser(req.session.user)});
          }
        });
 
});




router.get('/view-tl-list', (req, res) => {
  if(!req.session.user) {
      return res.redirect('/login');
  }
    var tl =[];
    User.find({role:'Recruiter'}, function(err, users){
          if(err){
              
          }
          if(users){
            tl=users;
          }
          });
    var assigner = req.query.assigner;
    User.find({role:'Team Leader'}, function(err, users){
        if(err){
          return res.render('view-tl',{"error":"No Users"});
        }
        if(users){
            Allocations.find({sublevel:assigner}, function(err, allocations){
                if(err){
                    return res.render('view-tl',{"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                }
                if(allocations){
                    return res.render('view-tl',{"selected":assigner ,"assign":allocations,"tl":tl,"users":users,'user': advUser(req.session.user)});
                }
            });
        }
      });
});

router.get('/view-recruiter', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
      User.find({role:'Recruiter'}, function(err, users){
          if(err){
            return res.render('view-recruiters',{"error":"No Users"});
          }
          if(users){
            return res.render('view-recruiters',{"users":users,'user': advUser(req.session.user)});
          }
        });
 
});

router.get('/add-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  return res.render('add-requirement',{'user': advUser(req.session.user)});
 
});

router.post('/add-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  var requirement = new Requirements();
  requirement.title = req.body.title;
  requirement.description = req.body.description;
  requirement.skills = req.body.skills;
  requirement.expirence = req.body.exp;
  requirement.client = req.session.user.email;
  requirement.status = 'pending';
  requirement.save(function(err, requirement){  //save the requirement
    if(err){
      return res.render('add-requirement',{"error":"Requirement already exists"});
    }
    if(requirement){
      return res.render('add-requirement',{'user': advUser(req.session.user),"success":"Requirement added"});
 
    }
  }
  );

 
});


router.get('/view-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  
      Requirements.find({client:req.session.user.email}, function(err, users){
          if(err){
            return res.render('view-requirements',{"error":"No Users"});
          }
          if(users){
            return res.render('view-requirements',{"users":users,'user': advUser(req.session.user)});
          }
        });
 
});


router.get('/view-requirements-only', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  
      Requirements.find({}, function(err, users){
          if(err){
            return res.render('view-requirements-only',{"error":"No Users"});
          }
          if(users){
            return res.render('view-requirements-only',{"users":users,'user': advUser(req.session.user)});
          }
        });
 
});


router.get('/close-requirement', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
      var id = req.query.id; 
      Requirements.findOneAndUpdate({_id:id}, {$set:{status:'closed'}}, function(err, users){

          if(err){
            return res.render('view-requirements',{"error":"No Users"});
          }
          if(users){
            return res.redirect('/view-requirements');
          }
        });
});

router.get('/view-detail-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
      var id = req.query.id;

      Fulfillment.find({requirement:id,interviewlevel:'3'}, function(err, candidates){
        if(err){  
          return res.render('view-detail-requirements',{"error":"No Users"});
        } 
        if(candidates){

          Requirements.find({client:req.session.user.email}, function(err, users){
            if(err){
              return res.render('view-requirements',{"error":"No Users"});
            }
            if(users){
              return res.render('view-requirements',{"users":users,'user': advUser(req.session.user),"candidates":candidates});
            }
          });
        }
      });
});


router.get('/selectCandidate', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }

  var id = req.query.id;

console.log('id',id);
  Fulfillment.findOne({_id:id}, function(err, candidate){ 
    if(err){
      console.log(err)
      return res.render('view-detail-requirements',{"error":"No Users"});
    }
    if(candidate){
      Requirements.findOneAndUpdate({_id:candidate.requirement}, {$set:{status:'selected'}}, function(err, users){
        if(err){
          return res.render('view-detail-requirements',{"error":"No Users"});
        }
        if(users){
          Fulfillment.findOneAndUpdate({_id:id}, {$set:{interviewlevel:'4',status:'selected'}}, function(err, users){
            return res.redirect('/view-detail-requirements?id='+candidate.requirement);
          });
        }
      });
    }
  });



});


router.post('/add-candidate', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  var filename = "";
  if(req.files.resume)
  {

    var file = req.files.resume;
    filename = Math.round(Math.random()*10000000)+file.name;
   
  var uploadPath =  path.join(__dirname, '..', 'static', 'uploads',filename);
  file.mv(uploadPath, function(err) {console.log(err)});
  }
  
  var candidate = new Candidates();
  candidate.name = req.body.name;
  candidate.email = req.body.email;
  candidate.phone = req.body.phone;
  candidate.skills = req.body.skills;
  candidate.experience = req.body.exp;
  candidate.resume = filename;

  candidate.status = "Active";
  candidate.save(function(err, candidate){
    if(err){
      return res.render('add-candidate',{"error":"Candidate already exists"});
    }
    if(candidate){
      return res.render('add-candidate',{'user': advUser(req.session.user),"success":"Requirement added"});
    }
    });
});

router.get('/add-candidate', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  
    return res.render('add-candidate',{'user': advUser(req.session.user)});
});


router.get('/view-all-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  var candidates = null;
  Candidates.find({},function(err, users){
    candidates = users;
  });

  Requirements.find({}, function(err, users){
    if(err){
      return res.render('view-requirements',{"error":"No Users"});
    }
    if(users){
      if(req.query.id){
        var id = req.query.id;

        Fulfillment.find({requirement:id}, function(err, fulfill){

          return res.render('view-all-requirements',{'fulfill':fulfill,"requirement":id,"candidates":candidates,"users":users,'user': advUser(req.session.user)});
        }
        );

      
       }else{
        return res.render('view-all-requirements',{"users":users,'user': advUser(req.session.user)});
      }
    }
  }
  );
});

router.get('/fullfill', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }
  var candidate = req.query.id;
  var requirement = req.query.requirement;

  var fulfillment = new Fulfillment();
  fulfillment.candidate = candidate;
  fulfillment.requirement = requirement;
  fulfillment.submittedby = req.session.user.email;
  fulfillment.interviewlevel = "1";
  fulfillment.status = "pending";
  fulfillment.save(function(err, fulfillment){
    if(fulfillment){
      return res.redirect('/view-all-requirements?id='+requirement);
    }
  });
  
});


router.get('/view-my-requirements', (req, res) => {
  if(!req.session.user){
      return res.redirect('/login');
  }

  var candidates = null;
  Candidates.find({},function(err, users){
    candidates = users;
  });

  if(req.session.user.role=='Recruiter'){
    
    Allocations.find({toplevel:req.session.user.email}, function(err, users){
      var data = [];
      users.forEach(function(user){data.push(user.sublevel)});
      

      Allocations.find({toplevel:{$in: data}}, function(err, users){
        var data = [];
        users.forEach(function(user){data.push(user.sublevel)});

        Allocations.find({toplevel:{$in: data}}, function(err, users){
          var data = [];
          users.forEach(function(user){data.push(user.sublevel)});
          Requirements.find({client:{$in: data}}, function(err, AcutalRequirements){
            console.log(AcutalRequirements);
            if(req.query.id){
              var id = req.query.id;
      
              Fulfillment.find({requirement:id}, function(err, fulfill){
      
                return res.render('view-all-requirements',{'fulfill':fulfill,"requirement":id,"candidates":candidates,"users": AcutalRequirements,'user': advUser(req.session.user)});
              }
              );
             }else{
              return res.render('view-all-requirements',{"users":AcutalRequirements,'user': advUser(req.session.user)});
            }
          });
        });
        
       });
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
           
            if(req.query.id){
              var id = req.query.id;
      
              Fulfillment.find({requirement:id}, function(err, fulfill){
      
                return res.render('view-all-requirements',{'fulfill':fulfill,"requirement":id,"candidates":candidates,"users": AcutalRequirements,'user': advUser(req.session.user)});
              }
              );
             }else{
              return res.render('view-all-requirements',{"users":AcutalRequirements,'user': advUser(req.session.user)});
            }
          });
        });
    });
  }


  if(req.session.user.role=='Manager'){

    Allocations.find({toplevel:req.session.user.email}, function(err, users){
      var data = [];
      users.forEach(function(user){data.push(user.sublevel)});
          Requirements.find({client:{$in: data}}, function(err, AcutalRequirements){
            console.log(AcutalRequirements);
            if(req.query.id){
              var id = req.query.id;
      
              Fulfillment.find({requirement:id}, function(err, fulfill){
      
                return res.render('view-all-requirements',{'fulfill':fulfill,"requirement":id,"candidates":candidates,"users": AcutalRequirements,'user': advUser(req.session.user)});
              }
              );
             }else{
              return res.render('view-all-requirements',{"users":AcutalRequirements,'user': advUser(req.session.user)});
            }
          });

    });
  }

  if(req.session.user.role=='Client'){
    
 
          Requirements.find({client:{$in: data}}, function(err, AcutalRequirements){
            console.log(AcutalRequirements);
            if(req.query.id){
              var id = req.query.id;
      
              Fulfillment.find({requirement:id}, function(err, fulfill){
      
                return res.render('view-all-requirements',{'fulfill':fulfill,"requirement":id,"candidates":candidates,"users": AcutalRequirements,'user': advUser(req.session.user)});
              }
              );
             }else{
              return res.render('view-all-requirements',{"users":AcutalRequirements,'user': advUser(req.session.user)});
            }
          });

    
  }
  
});




module.exports = router;