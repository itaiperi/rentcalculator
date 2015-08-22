/************************************************************************
/*
/* VERSION: 1.0
/*
/* MADE BY ITAI PERI, JULY 2015
/* itaiperi@campus.technion.ac.il     itaiperi@gmail.com
/*
************************************************************************/
var directions = require('./directions');
var errorGenerator = require('./errorgenerator');
var prices = require('./prices');
var addresses = require('./addresses');

// calculator itself
exports.calculate = function calculate (parameters, callback) {

  var errors = [];

  var originAddress = parameters.address;

  try {
    if (typeof(originAddress) != 'string') {
      throw (errorGenerator.error(10, 'address', typeof(originAddress), 'string'));
    }
    parameters.region = addresses.addressToRegion(originAddress);
    var pricesArray = evaluateParameters();
    var finalPrice = calculatePrice(pricesArray);
  } catch (exception) {
    errors = errors.concat(exception);
    callback({
      'statusCode': 1,
      'status': 'Errors were found.',
      'errors': errors
    });
    return;
  }

  callback({
    'statusCode': 0,
    'status': 'OK',
    'price': finalPrice
  });
  return;

  function evaluateParameters() {

    var pricesArray = [];
    var evaluationErrors = [];

    for (var key in prices) {
      try {
        var priceOfAttribute = getPriceOfAttribute(prices[key], key, parameters);
        pricesArray.push(priceOfAttribute);
      } catch (exception) {
        evaluationErrors.push(exception);
      }
    }

    if (evaluationErrors.length != 0) {
      console.log('SEVERE: errors in evaluateParameters:', evaluationErrors);
      throw (evaluationErrors);
    }
    
    return pricesArray;
  }

  function calculatePrice(pricesArray) {

    var accumulatedPrices = {
      'base': 0,
      'multiplier': 1,
      'fixedApartment': 0,
      'fixedRoom': 0
    }

    for (var key in pricesArray) {
      if (pricesArray[key].priceType == 'multiplier') {
        accumulatedPrices[pricesArray[key].priceType] = accumulatedPrices[pricesArray[key].priceType] * pricesArray[key].price;
      } else {
        accumulatedPrices[pricesArray[key].priceType] = accumulatedPrices[pricesArray[key].priceType] + pricesArray[key].price;
      }
    }

    var price = accumulatedPrices.base * accumulatedPrices.multiplier + accumulatedPrices.fixedApartment;
    if (parameters.arrangement == 'roommates') {
      price = price / parameters.roommates;
    }
    price = price + accumulatedPrices.fixedRoom;
    
    return price;
  }

  function getPriceOfAttribute(attributeData, key, parameters) {

    var parameterValue = parameters[key];

    if (parameterValue == undefined) {
      throw (errorGenerator.error(14, key, key));
    }

    if(typeof(parameters[key]) != attributeData.objectType) {
      throw (errorGenerator.error(10, key, typeof(parameters[key]), attributeData.objectType));
    }

    var priceType = attributeData.priceType;
    var valueType = attributeData.valueType;
    var price = undefined;

    if(key == 'floor') {
      var elevator = parameters['elevator'];
      var bars = parameters['bars'];
      if (elevator == undefined) {
        throw (errorGenerator.error(14, 'elevator'));
      } else if (bars == undefined) {
        throw (errorGenerator.error(14, 'bars'));
      }
      var mode = elevator*2 + bars*1;
      attributeData = attributeData.mode[mode];
    }

    switch (valueType) {
      case 'discrete':
        price = attributeData.price[parameterValue];
        break;
      case 'range':
        for (var range in attributeData.ranges) {
          range = attributeData.ranges[range];
          if (range.lowerBound == 'min' && parameterValue <= range.upperBound ||
            parameterValue > range.lowerBound && range.upperBound == 'max' ||
            parameterValue > range.lowerBound && parameterValue <= range.upperBound) {
            price = attributeData.price[range.id];
            break;
          }
        }
        break;
      default:
        throw (errorGenerator.error(20, key));
        break;
    }

    if (price == undefined) {
      throw(errorGenerator.error(11, key, parameters[key]));
    }

    return {
      'price': price,
      'priceType': priceType
    };
  }
}