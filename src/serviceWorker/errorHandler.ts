import { storeError } from './firebase';

const destinationError = 'specifies an incorrect value for the "action.redirect.regexSubstitution"';
const destinationError2 = 'specify the "regexSubstitution" key without specifying the "regexFilter" key';
const sourceError = 'specifies an incorrect value for the "regexFilter"';
const actionError = 'standard HTTP request headers that can specify multiple values for a single entry are supported';
const emptyHeaders = 'does not specify a value for "action.requestHeaders" or "action.responseHeaders" key';
const complexRegexFilter = 'more complex regex than allowed as part of the "regexFilter" key';

const errors = {
  [destinationError]: 'May you have backslash with number (\\1) please remove or change Match type',
  [destinationError2]: 'May you have backslash with number (\\1) please remove or change Match type',
  [sourceError]: 'Incorrect value',
  [actionError]: 'Only standard HTTP request headers that can specify multiple values, you may need to choose "Set" instead "Append"',
  [emptyHeaders]: 'May you need to specify headers for request or response, press "Add" button',
  [complexRegexFilter]: 'The source field has more characters than allowed',
}

const handleError = (error: any, data) => {
  const message = error.message;
  let errorData;
  if (message.includes(actionError)) {
    errorData = {
      fieldName: 'general',
      message: errors[actionError],
    }
  }
  if (message.includes(emptyHeaders)) {
    errorData = {
      fieldName: 'general',
      message: errors[emptyHeaders],
    }
  }
  if (message.includes(destinationError)) {
    errorData = {
      fieldName: 'destination',
      message: errors[destinationError],
    }
  }
  if (message.includes(destinationError2)) {
    errorData = {
      fieldName: 'destination',
      message: errors[destinationError2],
    }
  }
  if (message.includes(sourceError) || message.includes(complexRegexFilter)) {
    errorData = {
      fieldName: 'source',
      message: errors[sourceError],
    }
  }

  if(errorData) {
    storeError({message, data});
    return errorData;
  }

  storeError({message, data, type: 'unhandled'}); 
  return {
    fieldName: 'general',
    message: 'Unhandled error = ' + message,
  }
}

export default handleError;