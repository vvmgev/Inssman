const measurementId = "G-ZNXP6X0C5D";
const apiSecret = "nnzMGnNoQIaEyPRR4nQW3g";
const collectData = async (data = {}) => {
  fetch(`https://www.google-analytics.com/debug/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
    method: "POST",
    body: JSON.stringify({
      client_id: '12345667.112324324231',
      events: [{
        name: 'tutorial_begin',
        params: {
          "myKyes": "myValue"
        },
      }]
    })
  });
}


export default collectData;