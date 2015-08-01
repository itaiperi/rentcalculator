var request = require('request');
var async = require('async');
var errorGenerator = require('./errorgenerator.min');
var baseURL = 'http://maps.googleapis.com/maps/api/directions/json';


exports.getCityAndTimes = function getCityAndTimes(origin, destinations, callback) {

  async.parallel([
    function (callback) {
      getCity(origin, callback);
    },
    function (callback) {
      getTechnionWalkingTime(origin, destinations.slice(0), callback);
    },
    function (callback) {
      getBusstopWalkingTime(origin, destinations.slice(0), callback);
    }],
    function(err, results) {
      if(err) {
        for (var key in results) {
          if(results[key].hasOwnProperty('statusCode')) {
            callback(true, results[key]);
            break;
          }
        }
        // callback({'city': 'haifa', 'technionWalkingTime': 8, 'busstopWalkingTime': 2});
      } else {
        cityAndTimes = {
          'city': results[0],
          'technionWalkingTime': results[1],
          'busstopWalkingTime': results[2]
        };
        callback(null, cityAndTimes);
      }
    });
}

function getCity(origin, callback) {
  getCityAux(origin, callback);
}

function getCityAux(origin, callback) {

  var propertiesObject = {
    origin: encodeURI(origin),
    destination: encodeURI('Tel Aviv, Israel'),
    language: 'en'
  };

  request({url: baseURL, qs: propertiesObject}, function(err, response, body) {
    if(err) {
      callback(true, errorGenerator.error(15, 'address'));
      return;
    }
    try {
      var routeData = JSON.parse(body);
      checkLegalityDirectionsApiResult(routeData);
      var routeLegs = routeData['routes'][0]['legs'][0];
      city = routeLegs['start_address'].split(',')[1].trim().toLowerCase();
      callback(false, city);
    } catch (exception) {
      callback(true, exception);
    }
  });
}

function getTechnionWalkingTime(origin, destinations, callback) {
  getTechnionWalkingTimeAux(origin, destinations, null, callback);
}

function getTechnionWalkingTimeAux(origin, destinations, minTechnionWalkingTime, callback) {

  var propertiesObject = {
    origin: encodeURI(origin),
    destination: encodeURI(destinations[0]),
    mode: 'walking',
    language: 'en'
  };
  destinations.splice(0, 1);

  request({url: baseURL, qs: propertiesObject}, function(err, response, body) {
    if(err) {
      callback(true, errorGenerator.error(15, 'address'));
      return;
    }

    try {
      var routeData = JSON.parse(body);
      checkLegalityDirectionsApiResult(routeData);
      var routeLegs = routeData['routes'][0]['legs'][0];

      var currentTechnionWalkingTime = Math.round(routeLegs['duration']['value']/60);

      if (minTechnionWalkingTime == null) {
        minTechnionWalkingTime = currentTechnionWalkingTime;
      }
      if(destinations.length > 0) {
        minTechnionWalkingTime = Math.min(minTechnionWalkingTime, currentTechnionWalkingTime);
        getTechnionWalkingTimeAux(origin, destinations, minTechnionWalkingTime, callback);
      } else {
        callback(false, minTechnionWalkingTime);
        return;
      }
    } catch (exception) {
      callback(true, exception);
    }
  });
}

function getBusstopWalkingTime(origin, destinations, callback) {
  getBusstopWalkingTimeAux(origin, destinations, null, callback);
}

function getBusstopWalkingTimeAux(origin, destinations, minBusstopWalkingTime, callback) {

  var propertiesObject = {
    origin: encodeURI(origin),
    destination: encodeURI(destinations[0]),
    mode: 'transit',
    departure_time: '1436072400',
    language: 'en'
  };
  destinations.splice(0, 1);

  request({url: baseURL, qs: propertiesObject}, function(err, response, body) {
    if(err) {
      callback(true, errorGenerator.error(15, 'address'));
      return;
    }

    try {
      var routeData = JSON.parse(body);
      checkLegalityDirectionsApiResult(routeData);
      routeSteps = routeData['routes'][0]['legs'][0]['steps'];
      var transitExists = false;
      for (var key in routeSteps) {
        if(routeSteps[key]['travel_mode'] == 'TRANSIT') {
          transitExists = true;
        }
      }

      var currentBusstopWalkingTime = null;

      if(transitExists) {
        currentBusstopWalkingTime = Math.round(routeData['routes'][0]['legs'][0]['steps'][0]['duration']['value']/60);
      }

      if (minBusstopWalkingTime == null) {
        minBusstopWalkingTime = currentBusstopWalkingTime;
      }
      if(destinations.length > 0) {
        minBusstopWalkingTime = Math.min(minBusstopWalkingTime, currentBusstopWalkingTime);
        getBusstopWalkingTimeAux(origin, destinations, minBusstopWalkingTime, callback);
      } else {
        callback(false, minBusstopWalkingTime);
      }
    } catch (exception) {
      if(destinations.length > 0) {
        getBusstopWalkingTimeAux(origin, destinations, minBusstopWalkingTime, callback);
      } else if (minBusstopWalkingTime == null) {
        callback(false, null); // TODO handle, maybe there's no bus station, and maybe error!
      } else {
        callback(false, minBusstopWalkingTime);
      }
    }
  });
}

function checkLegalityDirectionsApiResult(result) {
  if (result.status != 'OK') {
    switch(result.status) {
      case 'NOT_FOUND':
      throw (errorGenerator.error(12, 'address'));
      break;
      case 'ZERO_RESULTS':
      throw (errorGenerator.error(16, 'address'));
      break;
      default:
      throw (errorGenerator.error(12, 'address'));
      break;
    }
  }
}