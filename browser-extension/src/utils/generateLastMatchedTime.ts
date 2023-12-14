import { timeDifference } from "./timeDifference";

export const generateLastMatchedTime = (timestamp: number): string => {
  if (typeof timestamp !== "number") return "Not used";
  const { days, hours, minutes, seconds } = timeDifference(timestamp);
  if (days) return `${days} day${days > 1 ? "s" : ""}  ago`;
  return `${hours > 0 ? `${hours}h` : ""} ${minutes > 0 ? `${minutes}m` : ""} ${
    hours > 0 ? "" : `${seconds}s`
  } ago`;
};
