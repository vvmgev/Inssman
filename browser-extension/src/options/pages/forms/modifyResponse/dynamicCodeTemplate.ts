const dynamicCodeTemplate = `function modifyResponse(args) {
  const { response } = args;

  // support only Fetch API
  // custom code here

  return response
}`;
export default dynamicCodeTemplate;
