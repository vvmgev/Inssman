const error2 = 'must not provide a header value for a header to be removed'
// match type contains
// source regexp
// with backslash \1
// Unhandled Error = Rule With Id 108 Does Not Specify A Value For "Action.RequestHeaders" Or "Action.ResponseHeaders" Key. At Least One Of These Keys Must Be Specified With A Non-Empty List.

const destinationError = 'specifies an incorrect value for the "action.redirect.regexSubstitution"';
const destinationError2 = 'specify the "regexSubstitution" key without specifying the "regexFilter" key';
const sourceError = 'specifies an incorrect value for the "regexFilter"';
const actionError = 'standard HTTP request headers that can specify multiple values for a single entry are supported';

const errors = {
  [destinationError]: 'may you have backslash with number (\\1) please remove or change Match type',
  [destinationError2]: 'may you have backslash with number (\\1) please remove or change Match type',
  [sourceError]: 'Specified an incorrect value',
  [actionError]: 'Only standard HTTP request headers that can specify multiple values',
}

const handleError = (error: any, data) => {
  console.log('backend', error.message);
  console.log('backend', error.message.includes('specifies an incorrect value for the'));
  const message = error.message;
  if (message.includes(actionError)) {
    return {
      fieldName: 'general',
      message: errors[actionError],
    }
  }
  if (message.includes(destinationError)) {
    return {
      fieldName: 'destination',
      message: errors[destinationError],
    }
  }
  if (message.includes(destinationError2)) {
    return {
      fieldName: 'destination',
      message: errors[destinationError2],
    }
  }
  if (message.includes(sourceError)) {
    return {
      fieldName: 'source',
      message: errors[sourceError],
    }
  }
  return {
      fieldName: 'general',
      message: 'Unhandled error = ' + message,
  }
}

export default handleError;