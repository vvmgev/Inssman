const dynamicCodeTemplate = `function modifyResponse(args) {
  const { response } = args;

  try {
    // custom code here
  } catch (error) {
    console.error(error);
    return response;
  }
}`;
export default dynamicCodeTemplate;
