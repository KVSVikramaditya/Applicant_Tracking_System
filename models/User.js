var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  name: String,
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"]},
  password: String, 
  role: String,
  company: String
}, {timestamps: true});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    body: this.body,
    createdAt: this.createdAt,
    name: this.name,
    email: this.email,
    password: this.password,
    role: this.role,
    company: this.company,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('User', CommentSchema);
