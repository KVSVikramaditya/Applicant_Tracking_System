var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
  requirement: String,
  candidate: String,
    submittedby: String,
    comment: String,
    interviewlevel: String,
    company: String,    
    status: String
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    requirement:this.requirement,
    candidate:this.candidate,
    submittedby:this.submittedby,
    comment:this.comment,
    interviewlevel:this.interviewlevel,
    company:this.company,
    status:this.status,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Fulfillments', CommentSchema);
