var mongoose = require('mongoose');



var CommentSchema = new mongoose.Schema({

    client: String,
    title : String,
    description : String,
    skills : String,
    expirence : String,
    company : String,
    status : String
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    client: this.client,
    title : this.title,
    description : this.description,
    skills : this.skills,
    expirence : this.expirence,
    company : this.company,
    status : this.status,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Requirements', CommentSchema);
