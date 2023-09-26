export const getTimeDifference = (timestamp) => {
  const currentTime = Date.now();
  const elapsedMilliseconds = currentTime - timestamp;

  // 1 minute = 60000 milliseconds
  const hours = Math.floor(elapsedMilliseconds / 3600000);
  // 1 minute = 60000 milliseconds
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000);
  // 1 second = 1000 milliseconds
  const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000);

  return {
    hours,
    minutes,
    seconds,
  };
};
