import { storeError } from './firebase';

const destinationError = 'specifies an incorrect value for the "action.redirect.regexSubstitution"';
const destinationError2 = 'specify the "regexSubstitution" key without specifying the "regexFilter" key';
const sourceError = 'specifies an incorrect value for the "regexFilter"';
const actionError = 'standard HTTP request headers that can specify multiple values for a single entry are supported';

const errors = {
  [destinationError]: 'May you have backslash with number (\\1) please remove or change Match type',
  [destinationError2]: 'May you have backslash with number (\\1) please remove or change Match type',
  [sourceError]: 'Incorrect value',
  [actionError]: 'Only standard HTTP request headers that can specify multiple values',
}

const handleError = (error: any, data) => {
  const message = error.message;
  storeError({message, data});
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

  const unhandledError = {
    type: 'unhandled',
    message,
    data
  };
  storeError(unhandledError);
  return {
    fieldName: 'general',
    message: 'Unhandled error = ' + message,
  }
}

export default handleError;