const error1 = 'Only standard HTTP request headers that can specify multiple values for a single entry are supported';
const error2 = 'must not provide a header value for a header to be removed'
// match type contains
// source regexp
// with backslash \1
const error3 = 'Unhandled error = Rule with id 95 can\'t specify the "regexSubstitution" key without specifying the "regexFilter" key';

const handleError = (error: any, data) => {
  const message = error.message;
  if (message.includes(error1)) {
    return error1;
  }
  if (message.includes(error2)) {
    return error2;
  }
  return 'Unhandled error = ' + message;
}

export default handleError;