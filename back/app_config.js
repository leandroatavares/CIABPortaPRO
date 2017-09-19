
var express = require('express');

var app = module.exports = express();

var bodyParser = require('body-parser');

var allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
}


app.listen(process.env.PORT||1337);

app.use(bodyParser.json());
app.use(allowCors); 

app.use(bodyParser.urlencoded({
    extended: true
}));