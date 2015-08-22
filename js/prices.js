module.exports = {

  /*********** BASE ***********/
  'rooms': { // TODO decide on these prices
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
    },
    'objectType': 'number',
    'valueType': 'discrete',
    'priceType': 'base'
  },
  
  /*********** MULTIPLIERS ***********/
  'region': { // TODO need to be set after addresses file
    'price': {
      1: 1,
      2: 0.9,
      3: 0.8,
      4: 0.7,
      5: 0.6,
      6: 0.5
    },
    'objectType': 'number',
    'valueType': 'discrete',
    'priceType': 'multiplier'
  },
  
  'renovationLevel': {
    'price': {
      'old': 0.8,
      'decent': 1,
      'partlyRenovated': 1.05,
      'renovated': 1.1
    },
    'objectType': 'string',
    'valueType': 'discrete',
    'priceType': 'multiplier'
  },

  'apartmentSize': {
    'ranges': [{ // TODO these should be per person, not the whole apartment size. meaning that small is if you have 10-15 m^2 per person, regular will be 15-25, etc. these are just examples.
      'id': '0-35',
      'lowerBound': 0,
      'upperBound': 35
    },
    {
      'id': '35-55',
      'lowerBound': 35,
      'upperBound': 55
    },
    {
      'id': '55-75',
      'lowerBound': 55,
      'upperBound': 75
    },
    {
      'id': '75-95',
      'lowerBound': 75,
      'upperBound': 95
    },
    {
      'id': '>95',
      'lowerBound': 95,
      'upperBound': 'max'
    }],
    'price': { // TODO these are the prices for the ranges above, by id.
      '0-35': 0.8,
      '35-55': 0.9,
      '55-75': 1,
      '75-95': 1.1,
      '>95': 1.2
    },
    'objectType': 'number',
    'valueType': 'range',
    'priceType': 'multiplier'
  },

  /*********** FIXED ADDITIONS ***********/
  'floor': { // TODO talk to keren about bars. cause floor 0 might not be ground floor, and then bars are not a must
    'mode': {
      0: { // elevator - no, bars - no
        'ranges': [{
          'id': '<-3',
          'lowerBound': 'min',
          'upperBound': -4
        },
        {
          'id': '-3',
          'lowerBound': -4,
          'upperBound': -3
        },
        {
          'id': '-2',
          'lowerBound': -3,
          'upperBound': -2
        },
        {
          'id': '-1',
          'lowerBound': -2,
          'upperBound': -1
        },
        {
          'id': '0',
          'lowerBound': -1,
          'upperBound': 0
        },
        {
          'id': '1',
          'lowerBound': 0,
          'upperBound': 1
        },
        {
          'id': '2',
          'lowerBound': 1,
          'upperBound': 2
        },
        {
          'id': '3',
          'lowerBound': 2,
          'upperBound': 3
        },
        {
          'id': '>3',
          'lowerBound': 3,
          'upperBound': 'max'
        }],
        'price': {
          '<-3': -70,
          '-3': -50,
          '-2': -25,
          '-1': 0,
          '0': 0,
          '1': 0,
          '2': -25,
          '3': -50,
          '>3': -70
        }
      },
      1: { // elevator - no, bars - yes
        'ranges': [{
          'id': '<-3',
          'lowerBound': 'min',
          'upperBound': -4
        },
        {
          'id': '-3',
          'lowerBound': -4,
          'upperBound': -3
        },
        {
          'id': '-2',
          'lowerBound': -3,
          'upperBound': -2
        },
        {
          'id': '-1',
          'lowerBound': -2,
          'upperBound': -1
        },
        {
          'id': '0',
          'lowerBound': -1,
          'upperBound': 0
        },
        {
          'id': '1',
          'lowerBound': 0,
          'upperBound': 1
        },
        {
          'id': '2',
          'lowerBound': 1,
          'upperBound': 2
        },
        {
          'id': '3',
          'lowerBound': 2,
          'upperBound': 3
        },
        {
          'id': '>3',
          'lowerBound': 3,
          'upperBound': 'max'
        }],
        'price': {
          '<-3': -70,
          '-3': -50,
          '-2': -25,
          '-1': 0,
          '0': 0,
          '1': 0,
          '2': -25,
          '3': -50,
          '>3': -70
        }
      },
      2: { // elevator - yes, bars - no
        'ranges': [{
          'id': '<5',
          'lowerBound': 'min',
          'upperBound': 4
        },
        {
          'id': '5-9',
          'lowerBound': 4,
          'upperBound': 9
        },
        {
          'id': '>9',
          'lowerBound': 9,
          'upperBound': 'max'
        }],
        'price': {
          '<5': 0,
          '5-9': 50,
          '>9': 100,
        }
      },
      3: { // elevator - yes, bars - yes
        'ranges': [{
          'id': '<5',
          'lowerBound': 'min',
          'upperBound': 4
        },
        {
          'id': '5-9',
          'lowerBound': 4,
          'upperBound': 9
        },
        {
          'id': '>9',
          'lowerBound': 9,
          'upperBound': 'max'
        }],
        'price': {
          '<5': 0,
          '5-9': 50,
          '>9': 100,
        }
      }
    },
    'objectType': 'number',
    'valueType': 'range',
    'priceType': 'fixedApartment',
  },

  'solarBoiler': { // TODO decide on prices
    'price': {
      true: 0,
      false: -50
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'nets': { // TODO decide on prices
    'price': {
      true: 0,
      false: -50
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'refrigerator': {
    'price': {
      true: 0,
      false: -50
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'laundryMachine': {
    'price': {
      true: 50,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'laundryDryer': {
    'price': {
      true: 25,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'oven': {
    'price': {
      true: 25,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'garden': {
    'price': {
      true: 150,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'balcony': {
    'price': {
      true: 100,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'roofBalcony': {
    'price': {
      true: 150,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'apartmentFurniture': {
    'price': {
      'full': 50,
      'partial': 0,
      'none': -50
    },
    'objectType': 'string',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'livingRoomAC': {
    'price': {
      true: 20,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedApartment'
  },

  'roomSize': {
    'price': {
      'small': -100, // 8-10 m^2
      'regular': 0, // 10-12 m^2
      'large': 100, // 12-15 m^2
      'huge': 200 // 15+ m^2
    },
    'objectType': 'string',
    'valueType': 'discrete',
    'priceType': 'fixedRoom'
  },

  'bedRoomAC': {
    'price': {
      true: 40,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedRoom'
  },

  'roomParentUnit': {
    'price': {
      true: 150,
      false: 0
    },
    'objectType': 'boolean',
    'valueType': 'discrete',
    'priceType': 'fixedRoom'
  },

  'roomFurniture': {
    'price': {
      'full': 50,
      'partial': 0,
      'none': -50
    },
    'objectType': 'string',
    'valueType': 'discrete',
    'priceType': 'fixedRoom'
  }
};