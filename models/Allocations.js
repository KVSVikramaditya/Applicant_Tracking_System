var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    sublevel: String,
    toplevel: String,
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    sublevel: this.sublevel,    
    toplevel: this.toplevel,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Allocations', CommentSchema);
