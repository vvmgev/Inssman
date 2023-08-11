export const getTimeDifference = (timestamp: number) => {
  const currentTime = Date.now();
  const elapsedMilliseconds = currentTime - timestamp;

  const hours = Math.floor(elapsedMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000); // 1 second = 1000 milliseconds

  return {
    hours,
    minutes,
    seconds
  };
}