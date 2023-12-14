export const throttle = (
  func: Function,
  delay: number
): ((...args: unknown[]) => void) => {
  let throttleRunning = false;
  let callImmedeiately = true;

  return function (...args: unknown[]) {
    if (throttleRunning) return;
    throttleRunning = true;

    setTimeout(() => {
      func(...args);
      throttleRunning = false;
    }, (callImmedeiately && 1) || delay);

    callImmedeiately = false;

    setTimeout(() => {
      callImmedeiately = true;
    }, delay);
  };
};
