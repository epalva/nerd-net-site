var express = require('express'),
    stylus = require('stylus'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan')
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path){
    return stylus(str).set('filename', path);
}

//Configuration section
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade'); 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

if(env === 'development')
    mongoose.connect('mongodb://localhost/nerd-net');
else
    mongoose.connect('mongodb://elroy:nerds@ds045107.mongolab.com:45107/nerd-net');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error....'));
db.once('open', function callback() {
    console.log('connected to mongodb');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model("Message", messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc){
    mongoMessage = messageDoc.message;
});


app.get('/partials/:partialPath', function(req, res){
    res.render('partials/' + req.params.partialPath);
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.get('*', function(req,res){
    res.render('index', {
    mongoMessage: mongoMessage
    });
});


var port = process.env.Port || 3000;
app.listen(port);

console.log('Listening on port '+ port + '...');