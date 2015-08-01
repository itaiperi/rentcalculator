var express = require('express');
var bodyParser = require('body-parser');
var calculator = require('./js/calculator.min')
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/resources/images'));
app.use(express.static(__dirname + '/resources/external-libraries'));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

app.get('/test123', function(request, response) {
  response.sendFile(__dirname + '/index_test.html');
});

app.post('/calculate', function(request, response) {
  console.log('INFO: received request from:', request.ip);
  function respond(result) {
    response.json(result);
  }
  calculator.calculate(request.body, respond);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});