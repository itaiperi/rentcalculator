var express = require('express');
var bodyParser = require('body-parser');
var calculator = require('./js/calculator');
var addresses = require('./js/addresses');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/resources/images'));
app.use(express.static(__dirname + '/resources/fonts'));
app.use(express.static(__dirname + '/resources/external-libraries'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

app.get('/getaddresses', function(request, response) {
  console.log('INFO: /getaddresses received request from:', request.ip, 'request:', request.query);
  response.json(addresses.findAddresses(request.query.address));
});

app.post('/calculate', function(request, response) {
  console.log('INFO: /calculate received request from:', request.ip, 'request:', request.post);
  function respond(result) {
    response.json(result);
  }
  calculator.calculate(request.body, respond);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});