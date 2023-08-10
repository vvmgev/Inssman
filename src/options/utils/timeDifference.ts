export const getTimeDifference = (startDate, endDate) => {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const timeDifferenceInMilliseconds = endTime - startTime; // milliseconds
    const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000; // seconds
    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60); // minutes
    const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60); // hours
    return {
      milliseconds: timeDifferenceInMilliseconds,
      seconds: timeDifferenceInSeconds,
      minutes: timeDifferenceInMinutes,
      hours: timeDifferenceInHours,
    };
  }
  
  
  
  
  