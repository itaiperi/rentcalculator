var errors = {
  0: {'statusCode': 0, 'status': 'OK'},
  10: {'statusCode': 10, 'status': 'Illegal parameter type, <replace1> instead of <replace2>.'},
  11: {'statusCode': 11, 'status': 'Illegal parameter value, <replace1>.'},
  12: {'statusCode': 12, 'status': 'Address not found.'},
  13: {'statusCode': 13, 'status': 'Database error, <replace1> is not a valid attribute'},
  14: {'statusCode': 14, 'status': 'Parameter not passed to calculator'},
  15: {'statusCode': 15, 'status': 'Did not receive any response from Google Directions API'},
  16: {'statusCode': 16, 'status': 'Google Directions API returned zero results'}
};

exports.error = function error(code, component, replace1, replace2) {
  var error = errors[code];
  error['component'] = component;
  error.status = error.status.replace('<replace1>', replace1);
  error.status = error.status.replace('<replace2>', replace2);
  return error;
}