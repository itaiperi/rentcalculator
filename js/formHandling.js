var formDataObj = {
  'address': '',
  'rooms': 0,
  'arrangement': '',
  'roommates': 0, 
  'floor': 0,
  'elevator': false,
  'renovationLevel': '',
  'apartmentSize': '',
  'roomSize': '',
  'roomParentUnit': false,
  'airConditioning': {
    'bedroom': false,
    'livingroom': false
  },
  'electricalAppliances': {
    'refrigerator': false,
    'laundryMachine': false,
    'oven': false
  },
  'roomFurniture': '',
  'apartmentFurniture': '',
  'garden': false,
  'balcony': false
}

var processingRequest = false;

function updateAddress(value) {
  formDataObj.address = value;
}

function updateRoomsNumber(val) {
  formDataObj.rooms= parseInt(val);
}

function updateLivingArrangement(val) {
  formDataObj.arrangement = val;
  if (val == 'roommates') {
    $('#roommates-div').show();
  }
  else {
    $('#roommates-div').hide();
  }
}

function updateRoommatesNumber(val) { 
  if(formDataObj.arrangement == 'roommates') { 
    formDataObj.roommates = parseInt(val);
  }

}

function updateFloor(val) {
  formDataObj.floor = parseInt(val);
}

function updateElevator(val) {
  formDataObj.elevator = val;
}

function updateRenovationLevel(val) {
  formDataObj.renovationLevel = val;
}

function updateApartmentSize(val) {
  formDataObj.apartmentSize = val; 
}

function updateRoomSize(val) {
  formDataObj.roomSize = val;
}

function updateRoomParentUnit(val) {
  formDataObj.roomParentUnit = val;
}

function updateLivingRoomAC(val) {
  formDataObj.airConditioning.livingroom = val;
}

function updateBedRoomAC(val) {
  formDataObj.airConditioning.bedroom = val;
}

function updateRoomFurniture(val) {
  formDataObj.roomFurniture = val;
}

function updateApartmentFurniture(val) {
  formDataObj.apartmentFurniture = val;
}

function updateGarden(val) {
  formDataObj.garden = val;
}

function updateBalcony(val) {
  formDataObj.balcony = val;
}

function updateRefrigerator(val) {
  formDataObj.electricalAppliances.refrigerator = val;
}

function updateOven(val) {
  formDataObj.electricalAppliances.oven = val;
}

function updateLaundryMachine(val) {
  formDataObj.electricalAppliances.laundryMachine = val;
}

// validating all relevant fields in form 

function processData(e) {

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
  $('#processingRequestMessageBox').hide();
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
      $('#processingRequestMessageBox').show();
    }
  }
}
