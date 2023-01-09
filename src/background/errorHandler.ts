const error1 = 'Only standard HTTP request headers that can specify multiple values for a single entry are supported';
// with key and value for remove
const error2 = 'must not provide a header value for a header to be removed'
// match type contains
// source regexp
// with backslash \1
const error3 = 'Unhandled error = Rule with id 95 can\'t specify the "regexSubstitution" key without specifying the "regexFilter" key';

// Unhandled Error = Rule With Id 108 Does Not Specify A Value For "Action.RequestHeaders" Or "Action.ResponseHeaders" Key. At Least One Of These Keys Must Be Specified With A Non-Empty List.

const handleError = (error: any, data) => {
  const message = error.message;
  if (message.includes(error1)) {
    return {
      fieldName: 'operation',
      message: error1,
    }
  }
  if (message.includes(error2)) {
    return {
      fieldName: 'operation',
      message: error2,
    }
  }
  return {
      fieldName: 'general',
      message: 'Unhandled error = ' + message,
  }
}

export default handleError;