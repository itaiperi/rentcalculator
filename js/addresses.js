var errorGenerator = require('./errorgenerator');

// converts a given address to a region, for calculations
exports.addressToRegion = function addressToRegion (address) {
  
  address = textToAddress(address);

  var addressCity = address.city;
  var addressStreet = address.street;
  var addressNumber = address.number;

  if (addressStreet == '' || addressNumber == null || addressCity == null) {
    throw (errorGenerator.error(12, 'address'));
  }

  var region = undefined;

  loop: for (var city in addresses.cities) {
    city = addresses.cities[city];
    if (city.name != addressCity) {
      continue;
    }
    for(var street in city.streets) {
      street = city.streets[street];
      if (street.name == addressStreet) {
        for(var range in street.numbers) {
          range = street.numbers[range];
          if (isNumberInRange(addressNumber, range)) {
            region = range.region;
            break loop;
          }
        }
      }
    }
  }

  if (region == undefined) {
    throw (errorGenerator.error(12, 'address'));
  } else {
    return region;
  }
}

// return an array of streets which include partialAddress as a substring of their street name
exports.findAddresses = function findAddresses(partialAddress) {

  partialAddress = textToAddress(partialAddress);

  var addressCity = partialAddress.city;
  var addressStreet = partialAddress.street;
  var addressNumber = partialAddress.number;

  var streets = [];

  if (addressStreet != '') {
    for (var city in addresses.cities) {
      city = addresses.cities[city];
      if(addressCity && !city.name.startsWith(addressCity)) {
        continue;
      }
      for (var street in city.streets) {
        street = city.streets[street];
        if (street.name.search(addressStreet) != -1) {
          if(addressNumber) {
            for(var range in street.numbers) {
              range = street.numbers[range];
              if (isNumberInRange(addressNumber, range)) {
                streets.push(street.name + " " + addressNumber + ", " + city.name);
                break;
              }
            }
          } else {
            streets.push(street.name + ", " + city.name);
          }
        }
      }
    }
  }
  return streets;
}

// parses a string to an address object
function textToAddress(textAddress) {

  var address = {'city': null, 'street': '', 'number': null};
  var splitAddress = textAddress.trim().split(/,/);
  try {
    address.city = splitAddress[1].trim();
  } catch (e) {
    address.city = null;
  }
  var splitStreet = splitAddress[0].split(/ /);

  for (var word in splitStreet) {
    if (!isNaN(splitStreet[word])) {
      address.number = parseInt(splitStreet[word]);
      break;
    } else {
      address.street = address.street.concat(splitStreet[word].trim() + " ");
    }
  }

  if (address.street.length != 0) {
    address.street = address.street.slice(0, address.street.length-1);
  }

  return address;
}

function isNumberInRange(number, range) {

  var even = (number % 2) == 0;

  return ((even &&
    (range.evenLowerBound == 'min' && range.evenUpperBound == 'max' ||
    range.evenLowerBound == 'min' && number <= range.evenUpperBound ||
    number > range.evenLowerBound && range.evenUpperBound == 'max' ||
    number > range.evenLowerBound && number <= range.evenUpperBound)) ||
    (!even &&
    (range.oddLowerBound == 'min' && range.oddUpperBound == 'max' ||
    range.oddLowerBound == 'min' && number <= range.oddUpperBound ||
    number > range.oddLowerBound && range.oddUpperBound == 'max' ||
    number > range.oddLowerBound && number <= range.oddUpperBound)));
}

String.prototype.startsWith = function startsWith(str) {
  return this.indexOf(str) === 0;
};

var addresses = {
  'cities': [{
    'name': 'חיפה',
    'streets': [{
      'name': 'רחוב1',
      'numbers': [{
        'region': 1,
        'oddLowerBound': 1,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 2,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 2,
        'evenUpperBound': 4
      }]
    },
    {
      'name': 'רחוב2',
      'numbers': [{
        'region': 2,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 4,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      }]
    },
    {
      'name': 'רחוב3',
      'numbers': [{
        'region': 6,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 5,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      }]
    },
    {
      'name': 'סתם משהו',
      'numbers': [{
        'region': 6,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 5,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      }]
    }]
  },
  {
    'name': 'נשר',
    'streets': [{
      'name': 'רחוב1',
      'numbers': [{
        'region': 1,
        'oddLowerBound': 1,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 2,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 4
      }]
    },
    {
      'name': 'רחוב2',
      'numbers': [{
        'region': 2,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 4,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 2,
        'evenUpperBound': 4
      }]
    },
    {
      'name': 'רחוב3',
      'numbers': [{
        'region': 6,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 5,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      }]
    },
    {
      'name': 'סתם משהו',
      'numbers': [{
        'region': 6,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      },
      {
        'region': 5,
        'oddLowerBound': 0,
        'oddUpperBound': 1,
        'evenLowerBound': 0,
        'evenUpperBound': 2
      }]
    }]
  },]
}