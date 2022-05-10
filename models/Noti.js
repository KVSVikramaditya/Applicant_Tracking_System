var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
  heading: String,
  details: String
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    heading: this.heading,
    details: this.details,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Noti', CommentSchema);
