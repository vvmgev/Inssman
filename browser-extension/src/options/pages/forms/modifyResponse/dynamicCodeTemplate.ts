const dynamicCodeTemplate = `function modifyResponse(args) {
  const { response } = args;
  // support only Fetch API

  try {
    // custom code here
  } catch (error) {
    console.error(error);
    return response;
  }
}`;
export default dynamicCodeTemplate;
