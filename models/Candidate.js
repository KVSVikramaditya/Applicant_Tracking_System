var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
  name: String,
  email:String,
    phone:String,
    skills:String,
    experience:String,
    status:String,
    comment:String,
    resume:String
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    name: this.name,
    email:this.email,
    phone:this.phone,
    skills:this.skills,
    experience:this.experience,
    status:this.status,
    comment:this.comment,
    resume:this.resume,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Candidate', CommentSchema);
