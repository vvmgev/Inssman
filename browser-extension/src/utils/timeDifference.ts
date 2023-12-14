export const timeDifference = (timestamp: number, startTimestamp?: number) => {
  const elapsedMilliseconds = (startTimestamp || Date.now()) - timestamp;

  const days = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24)); // 1 day = 86400000 milliseconds
  const hours = Math.floor(elapsedMilliseconds / 3600000); // 1 hour = 3600000 milliseconds
  const minutes = Math.floor((elapsedMilliseconds % 3600000) / 60000); // 1 minute = 60000 milliseconds
  const seconds = Math.floor((elapsedMilliseconds % 60000) / 1000); // 1 second = 1000 milliseconds

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
