var formDataObj = {
  'address': '',
  'rooms': 0,
  'arrangement': '',
  'roommates': 0, 
  'floor': 0,
  'elevator': false,
  'bars': false,
  'renovationLevel': '',
  'apartmentSize': '',
  'roomSize': '',
  'roomParentUnit': false,
  'solarBoiler': false,
  'bars': false,
  'nets': false,
  'bedRoomAC': false,
  'livingRoomAC': false,
  'refrigerator': false,
  'laundryMachine': false,
  'laundryDryer': false,
  'oven': false,
  'roomFurniture': '',
  'apartmentFurniture': '',
  'garden': false,
  'balcony': false,
  'roofBalcony': false
}

$('#address').typeahead({
  hint: true,
  highlight: true,
  minLength: 1,
  maxItem: 8,
  dynamic: true,
  source: {
    addresses: {
      url: {
        type: 'GET',
        url: '/getaddresses/',
        data: {
          address: '{{query}}'
        }
      }
    }
  },
  callback: {
    onClickAfter: function(node, query) {
      updateData('address', $('#address').val(), 'string');
    }
  }
});

var processingRequest = false;

function updateData(field, value, type) {
  if (field == 'arrangement') {
    if (value == 'roommates') {
      $('#roommates-div').show();
      $('#roommatesNumberSelect').val('0');
      $('#roomSize-div').show();
      $('#roomSize').val('');
      $('#roomParentUnit-div').show();
      $('#roomParentUnit').prop('checked', false);
    }
    else {
      $('#roommates-div').hide();
      formDataObj.roommates = 0;
      $('#roomSize-div').hide();
      formDataObj.roomSize = '';
      $('#roomParentUnit-div').hide();
      formDataObj.roomParentUnit = false;
    }
  }

  switch (type) {
    case 'number':
      formDataObj[field] = parseFloat(value);
      break;
    default:
      formDataObj[field] = value;
      break;
  }
}

// validating all relevant fields in form 

function processData(e) {

  console.log(formDataObj);

  var fieldsToCheck = {
    'address': {'default': '', 'controlDivName': 'address-div'},
    'rooms': {'default': 0, 'controlDivName': 'rooms-div'},
    'arrangement': {'default': '', 'controlDivName': 'arrangement-div'},
    'roommates': {'default': 0, 'controlDivName': 'roommates-div'},
    'renovationLevel': {'default': '', 'controlDivName': 'renovationLevel-div'},
    'apartmentSize': {'default': '', 'controlDivName': 'apartmentSize-div'},
    'roomSize': {'default': '', 'controlDivName': 'roomSize-div'},
    'roomFurniture': {'default': '', 'controlDivName': 'roomFurniture-div'},
    'apartmentFurniture': {'default': '', 'controlDivName': 'apartmentFurniture-div'}
  };
  var errorsFound = false;

  for (var field in fieldsToCheck) {
    fieldObj = fieldsToCheck[field];
    if(formDataObj[field] == fieldObj.default) {
      if(field == 'roommates' && formDataObj.arrangement != 'roommates') {
        $('#' + fieldObj.controlDivName).removeClass('has-error');
        continue;
      }
      $('#' + fieldObj.controlDivName).addClass('has-error');
      errorsFound = true;
    } else {
      $('#' + fieldObj.controlDivName).removeClass('has-error');
    }
  }

  $('#finalPriceBox').hide();
  $('#errorsMessageBox').hide();
  $('#emptyFieldsMessageBox').hide();

  if(errorsFound) {
    $('#emptyFieldsMessageBox').show();
    return;
  } else {
    if(!processingRequest) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          var result = JSON.parse(xhr.responseText);
          if (result.statusCode == 0) {
            var range = 50;
            result.lowerBound = Math.floor(result.price / range) * range;
            result.upperBound = Math.ceil(result.price / range) * range;
            $('#priceFinal').text(result.lowerBound + (result.lowerBound < result.upperBound ? (' - ' + result.upperBound) : ''));
            $('#finalPriceBox').show();
          } else {
            var errorsString = '';
            for (var key in result.errors) {
              errorsString = errorsString.concat('<br/>');
              errorsString = errorsString.concat('שגיאה בשדה: ', result.errors[key].component);
              errorsString = errorsString.concat(', סיבת השגיאה: ', result.errors[key].status);
            }
            $('#calculationErrors').html(errorsString);
            $('#errorsMessageBox').show();
          }
          processingRequest = false;
        }
      }
      xhr.open('POST', '/calculate', true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      processingRequest = true;
      xhr.send(JSON.stringify(formDataObj));
    } else {
      $('#finalPriceBox').hide();
    }
  }
}
