/************************************************************************
/*
/* VERSION: 1.0
/*
/* MADE BY ITAI PERI, JULY 2015
/* itaiperi@campus.technion.ac.il     itaiperi@gmail.com
/*
/* A FEW NOTES:
/*  1. Database->prices holds attributes that affect the price
/*  2. Each attribute (or sub-attribute) eventually has a value_type, which can be string or number, depending on the value the attribute may receive.
/*  3. Each number attribute may have min, max, under and over properties. min indicates the minimum value, max the maximum, and over and under are the prices for going under the minimum or over the maximum.
/*  4. There are four types of prices: base, multipliers, fixed_apartment, fixed_room. base is the base we work with, we then multiply by all multipliers, add fixed_apartment, divide by number of roommates if it's a roommates' apartment, and then add fixed_room
/*  5. There are a few error types, which can be seen under Database->errors.
/*
************************************************************************/
var directions = require('./directions.min');
var errorGenerator = require('./errorgenerator.min');

var Database = {
  'additionalInfo': {
        'expectedPersons': { // per number of rooms in apartment
          1: 1,
          1.5: 1,
          2: 1,
          2.5: 1,
          3: 2,
          3.5: 2,
          4: 3,
          4.5: 3,
          5: 4,
          5.5: 4,
          'min': 1,
          'max': 5.5
        },
        'arrangement': {
          'roommmates': 'roommates',
          'couple': 'couple',
          'single': 'single'
        },
        'roommates': {
          2: 2,
          3: 3,
          4: 4,
          'min': 2,
          'max': 4
        },
        'elevator': {
          true: 1,
          false: -1
        }
      },

      'prices': {
        /*********** BASE ***********/
        'rooms': {
          'price': {
            1: 1550,
            1.5: 1850,
            2: 2200,
            2.5: 2450,
            3: 2500,
            3.5: 2600,
            4: 3250,
            4.5: 3350,
            5: 4150,
            5.5: 4250,
            'min': 1,
            'max': 5.5
          },
          'value_type': 'number',
          'price_type': 'base'
        },
        
        /*********** MULTIPLIERS ***********/
        'city': {
          'price': {
            'haifa': 1,
            'nesher': 0.9
          },
          'value_type': 'string',
          'price_type': 'multiplier'
        },
        
        'renovationLevel': {
          'price': {
            'old': 0.8,
            'decent': 1,
            'renovated': 1.08,
            'premium': 1.2
          },
          'value_type': 'string',
          'price_type': 'multiplier'
        },

        'apartmentSize': {
          'price': {
            'small': 0.94,
            'regular': 1,
            'large': 1.08
          },
          'value_type': 'string',
          'price_type': 'multiplier'
        },

        'roomSize': {
          'price': {
                'small': 0.94, // 8-10 m^2
                'regular': 1, // 10-12 m^2
                'large': 1.08 // over 12 m^2
              },
              'value_type': 'string',
              'price_type': 'multiplier'
            },

            /*********** FIXED ADDITIONS ***********/
            'floor': {
              'price': {
                '-3': 20,
                '-2': 10,
                '-1': 0,
                '0': 0,
                '1': 0,
                '2': 10,
                '3': 20,
                'min': -3,
                'max': 3,
                'under': 25,
                'over': 25
              },
              'value_type': 'number',
              'price_type': 'fixed_apartment',
              'dependencies': [{
                'path': ['additionalInfo', 'elevator'],
                'action': 'multiply'
              }]
            },

            'electricalAppliances': {
              'refrigerator': {
                'price': {
                  true: 0,
                  false: -50
                },
                'value_type': 'boolean',
                'price_type': 'fixed_apartment'
              },
              'laundryMachine': {
                'price': {
                  true: 50,
                  false: 0
                },
                'value_type': 'boolean',
                'price_type': 'fixed_apartment'
              },
              'oven': {
                'price': {
                  true: 25,
                  false: 0
                },
                'value_type': 'boolean',
                'price_type': 'fixed_apartment'
              }
            },

            'garden': {
              'price': {
                true: 150,
                false: 0
              },
              'value_type': 'boolean',
              'price_type': 'fixed_apartment'
            },

            'balcony': {
              'price': {
                true: 100,
                false: 0
              },
              'value_type': 'boolean',
              'price_type': 'fixed_apartment'
            },

            'apartmentFurniture': {
              'price': {
                'full': 50,
                'partial': 0,
                'none': -50
              },
              'value_type': 'string',
              'price_type': 'fixed_apartment'
            },

        'technionWalkingTime': { // maximum walking time in minutes from apartment to Nave Shaanan / Nesher gates.
          'price': {
            0: 250,
            5: 250,
            10: 0,
            15: -100,
            20: -150,
            'min': 0,
            'max': 20,
            'over': -200
          },
          'value_type': 'number',
          'price_type': 'fixed_apartment'
        },

        'airConditioning': {
          'livingroom': {
            'price': {
              true: 20,
              false: 0
            },
            'value_type': 'boolean',
            'price_type': 'fixed_apartment'
          },
          'bedroom': {
            'price': {
              true: 40,
              false: 0
            },
            'value_type': 'boolean',
            'price_type': 'fixed_room'
          }
        },

        'roomParentUnit': {
          'price': {
                true: 200,  // fixed price, added after getting price for room
                false: 0
              },
              'value_type': 'boolean',
              'price_type': 'fixed_room'
            },

            'roomFurniture': {
              'price': {
                'full': 50,
                'partial': 0,
                'none': -50
              },
              'value_type': 'string',
              'price_type': 'fixed_room'
            }

            /*********** NOT IN USE YET ***********/
        /* matrix covering rooms > 2, for all roomates (for rare cases of 3 roomates in 5 rooms, etc.)
        'roomatesRoomsMatrix': [
            [1, 1, 1, 1, 1, 1, 1], // 2 roomates
            [1, 1, 1, 1, 1, 1, 1], // 3 roomates
            [1, 1, 1, 1, 1, 1, 1] // 4 roomates
        ],

        'busstopWalkingTime': { //maximum walking time in minutes from apartment to nearest bus stop to technion
            'test': 'test'
          }*/
        },

      'destinationCoordinates': [
        '32.778581,35.015598', // coordinates for Nosh gate
        '32.781417,35.023345', // coordinates for Canada gate
        '32.774235,35.029547', // coordinates for Nesher Main gate
        '32.772995,35.029032' // coordinates for Nesher Mizrah Pedestrians' gate
      ]
    };

// calculator itself
exports.calculate = function calculate (parameters, callback) {
  var errors = [];

  var originAddress = parameters.address;
  var cityAndTimes;

  if (typeof(originAddress) != 'string') {
    errors.push(errorGenerator.error(10, 'address', typeof(originAddress), 'string'));
    callback({
      'statusCode': 1,
      'status': 'Errors were found.',
      'errors': errors
    });
    return;
  }
  
  directions.getCityAndTimes(originAddress, Database.destinationCoordinates, evaluateParameters);

  // merge cityAndTimes into parameters
  function evaluateParameters(err, cityAndTimes) {

    if(err) {
      errors.push(cityAndTimes);
      callback({
        'statusCode': 1,
        'status': 'Errors were found.',
        'errors': errors
      });
      return;
    }

    for (var key in cityAndTimes) {
      if(key == 'technionWalkingTime' || key == 'busstopWalkingTime') {
        parameters[key] = closestLargerFiveMultiplier(cityAndTimes[key]);
      } else {
        parameters[key] = cityAndTimes[key];
      }
    }

    var pricesArray = [];
    for (var key in Database['prices']) {
      try {
        getPriceOfAttribute(Database['prices'], key, pricesArray, parameters);
      } catch (exception) {
        var error = {
          'component': exception.component,
          'statusCode': exception.statusCode,
          'status': exception.status
        };
        errors.push(error);
      }
    }

    if (errors.length != 0) {
      console.log('SEVERE: errors in evaluateParameters:', errors);
      callback({
        'statusCode': 1,
        'status': 'Errors were found.',
        'errors': errors
      });
      return;
    }
    calculatePrice(pricesArray);
  }

  // calculations from here on. shouldn't be any errors
  function calculatePrice(pricesArray) {

    var prices = {
      'base': 0,
      'multiplier': 1,
      'fixed_apartment': 0,
      'fixed_room': 0
    }

    for (var key in pricesArray) {
      if (pricesArray[key].price_type == 'multiplier') {
        prices[pricesArray[key].price_type] = prices[pricesArray[key].price_type] * pricesArray[key].price;
      } else {
        // fixed price or base, so we need to add, not multiply
        prices[pricesArray[key].price_type] = prices[pricesArray[key].price_type] + pricesArray[key].price;
      }
    }

    price = prices.base * prices.multiplier + prices.fixed_apartment;
    if (parameters.arrangement == 'roommates') {
      price = price / parameters.roommates;
    }
    price = price + prices.fixed_room;
    callback ({
      'statusCode': 0,
      'status': 'OK',
      'price': price
    });
  }
}

function getPriceOfAttribute(obj, key, pricesArray, parameters) {
  if (obj[key].hasOwnProperty('price_type')) {
    var price = obj[key].price[parameters[key]];
    var price_type = obj[key].price_type;

    if (parameters[key] == undefined) {
      throw (errorGenerator.error(14, key, key));
    }

    if(typeof(parameters[key]) != obj[key].value_type) {
      throw (errorGenerator.error(10, key, typeof(parameters[key]), obj[key].value_type));
    }

    // if value of parameters[key] is not in database, this handles it.
    // it might be due to wrong parameter, or might be because of going over maximum or under minimum of 'number' type attribute
    if (price == undefined) {
      if (obj[key].value_type == 'number') {
        if (parameters[key] > obj[key].price.max && obj[key].price.hasOwnProperty('over')) {
          price = obj[key].price.over;
        } else if (parameters[key] < obj[key].price.min && obj[key].price.hasOwnProperty('under')) {
          price = obj[key].price.under;
        } else {
          throw (errorGenerator.error(11, key, parameters[key]));
        }
      } else {
        throw (errorGenerator.error(11, key, parameters[key]));
      }
    }

    if (obj[key].hasOwnProperty('dependencies')) {
      var dependee = Database;
      for (var dependency in obj[key].dependencies) {
        var firstRun = true;
        var tempParameters = parameters;
        dependencyPath = obj[key].dependencies[dependency].path;
        for (var key3 in dependencyPath) {
          dependee = dependee[dependencyPath[key3]];
          if (!firstRun) {
            tempParameters = tempParameters[dependencyPath[key3]];
          }
          firstRun = false;
        }
        if (obj[key].dependencies[dependency].action == 'multiply') {
          price = price * dependee[tempParameters];
        }
      }
    }

    pricesArray.push({
      'price': price,
      'price_type': price_type
    });

  } else if(typeof(obj[key]) == 'object') {
    for (var key2 in obj[key]) {
      getPriceOfAttribute(obj[key], key2, pricesArray, parameters[key]);
    }
  } else {
    throw (errorGenerator.error(13, key, key));
  }
}

function closestLargerFiveMultiplier(number) {
    return 5*Math.ceil(number/5);
}
