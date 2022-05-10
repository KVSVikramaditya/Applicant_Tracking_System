
var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    mustacheExpress = require('mustache-express'),
    cookieParser = require("cookie-parser"), fileUpload = require('express-fileupload');;

mongoose.connect('mongodb://localhost:27017/ats');
const app = express();
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

require('./models/User');
require('./models/Allocations');
require('./models/Candidate');
require('./models/Fulfillment');
require('./models/Noti');
require('./models/Requirements');




app.use(express.static(__dirname + '/static'));
app.use(session({ secret: 'somesecrestkey', cookie: { maxAge: 6000000 }, resave: false, saveUninitialized: false  }));
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views","views");
app.use(cookieParser());


app.use(require('./routes'))

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})